
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/products
// Supports: ?search=bitmain&page=1&limit=10&manufacturer=Bitmain&category=asic-miner

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const search = searchParams.get("search");
    const manufacturer = searchParams.get("manufacturer");
    const category = searchParams.get("category");

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) || 12)
    );

    const where = {
      status: "ACTIVE" as const,

      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { manufacturer: { contains: search, mode: "insensitive" as const } },
          { model: { contains: search, mode: "insensitive" as const } },
        ],
      }),

      ...(manufacturer && { manufacturer }),

      ...(category && {
        categories: {
          some: { slug: category },
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: "asc" } },
          categories: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      manufacturer,
      model,
      images = [],
      categories = [],
      tags = [],
      ...specifications
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof manufacturer !== "string" ||
      !manufacturer.trim() ||
      typeof model !== "string" ||
      !model.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid required product fields" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(images) ||
      !Array.isArray(categories) ||
      !Array.isArray(tags) ||
      !images.every(
        (image: any) =>
          typeof image.url === "string" &&
          image.url.trim().length > 0
      ) ||
      !categories.every((item: unknown) => typeof item === "string") ||
      !tags.every((item: unknown) => typeof item === "string")
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid images, categories or tags" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description,
        price: Number(price),

        currency: body.currency ?? "AED",
        manufacturer,
        model,

        algorithm: specifications.algorithm,
        hashRate: specifications.hashRate,
        power: specifications.power,
        cooling: specifications.cooling,
        noiseLevel: specifications.noiseLevel,

        stock: specifications.stock ?? 0,
        isNew: specifications.isNew ?? false,
        featured: specifications.featured ?? false,

        images: {
          create: images.map((image: any, index: number) => ({
            url: image.url,
            alt: image.alt ?? name,
            position: image.position ?? index,
            isPrimary: image.isPrimary ?? index === 0,
          })),
        },

        categories: {
          connectOrCreate: categories.map((category: string) => ({
            where: { slug: slugify(category) },
            create: {
              name: category,
              slug: slugify(category),
            },
          })),
        },

        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { slug: slugify(tag) },
            create: {
              name: tag,
              slug: slugify(tag),
            },
          })),
        },
      },

      include: {
        images: true,
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}