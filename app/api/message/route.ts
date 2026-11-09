import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Max messages allowed from one IP within the window
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const messageSchema = z
  .object({
    topic: z.enum(["BUYING_A_RIG", "HOSTING", "SUPPORT", "PARTNERSHIP", "OTHER"], {
      message: "Choose what we can help with.",
    }),
    fullName: z.string().trim().min(1, "Enter your name.").max(120, "Name is too long."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address, like name@example.com.")
      .max(254, "Email is too long."),
    company: z
      .string()
      .trim()
      .max(160, "Company name is too long.")
      .optional()
      .transform((v) => (v ? v : null)),
    minerCount: z
      .enum(["ONE_TO_FIVE", "SIX_TO_TWENTY", "TWENTY_ONE_TO_ONE_HUNDRED", "OVER_ONE_HUNDRED"], {
        message: "Choose how many miners you're planning.",
      })
      .optional(),
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more, at least 10 characters.")
      .max(1000, "Keep your message to 1000 characters or fewer."),
    consent: z.literal(true, { message: "Agree to the privacy policy so we can reply." }),
    // Honeypot: a hidden input real users never fill in
    website: z.string().optional(),
  })
  .refine((d) => !(d.topic === "BUYING_A_RIG" || d.topic === "HOSTING") || d.minerCount, {
    message: "Choose how many miners you're planning.",
    path: ["minerCount"],
  });

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request. Please try again." }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  const { website, consent: _consent, minerCount, ...data } = parsed.data;

  // Bot filled the honeypot: pretend success, store nothing
  if (website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const needsFleet = data.topic === "BUYING_A_RIG" || data.topic === "HOSTING";
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? null;

  try {
    if (ipAddress) {
      const recentCount = await prisma.contactMessage.count({
        where: {
          ipAddress,
          createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
        },
      });

      if (recentCount >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "You've sent a few messages already. Please wait a few minutes and try again." },
          { status: 429 }
        );
      }
    }

    const saved = await prisma.contactMessage.create({
      data: {
        ...data,
        minerCount: needsFleet ? minerCount : null,
        consentedAt: new Date(),
        ipAddress,
        userAgent,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("[message] Failed to save message:", error);
    return NextResponse.json(
      { error: "Our server ran into a problem. Please try again in a moment." },
      { status: 500 }
    );
  }
}