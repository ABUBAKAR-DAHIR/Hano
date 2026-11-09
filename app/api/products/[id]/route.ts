
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

type Context = {
  params: Promise<{ id: string }>;
};

// GET /api/products/:id

export async function GET(
  _request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        categories: true,
        tags: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/:id

export async function PATCH(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "name",
      "description",
      "price",
      "compareAtPrice",
      "currency",
      "manufacturer",
      "model",
      "algorithm",
      "hashRate",
      "power",
      "cooling",
      "noiseLevel",
      "stock",
      "isNew",
      "featured",
      "status",
    ] as const;

    const data: Prisma.ProductUpdateInput = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (data as Record<string, unknown>)[field] = body[field];
      }
    }

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid product name" },
          { status: 400 }
        );
      }

      data.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (
      body.price !== undefined &&
      (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid price" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
  
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "A product with this slug already exists" },
          { status: 409 }
        );
      }
    }
  
    console.error(
      "UPDATE PRODUCT ERROR:",
      error instanceof Error ? error.message : error
    );
  
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id

export async function DELETE(
  _request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError 
    ) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}