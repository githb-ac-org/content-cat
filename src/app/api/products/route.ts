import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - List all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, referenceImages } = body;

    if (!name || !referenceImages || referenceImages.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one reference image are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        referenceImages,
        thumbnailUrl: referenceImages[0], // Use first image as thumbnail
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
