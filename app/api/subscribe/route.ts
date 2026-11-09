import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest) {
    try {
      const body = await request.json().catch(() => null);
  
      const email =
        body && typeof body.email === "string"
          ? body.email.trim().toLowerCase()
          : "";
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!email || email.length > 254 || !emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid email address.",
          },
          { status: 400 }
        );
      }
  
      // 1. Check whether email already exists
      const existingSubscription = await prisma.emailSubscription.findUnique({
        where: { email },
      });
  
      if (existingSubscription) {
        return NextResponse.json(
          {
            success: false,
            message: "You are already subscribed.",
          },
          { status: 409 }
        );
      }
  
      // 2. Create a new subscription
      const subscription = await prisma.emailSubscription.create({
        data: {
          email,
        },
      });
  
      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed!",
          data: {
            id: subscription.id,
            email: subscription.email,
          },
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      console.error("SUBSCRIPTION ERROR:", error);
  
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong. Please try again later.",
        },
        { status: 500 }
      );
    }
  }