import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { deleteImage } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    console.log("=== API RECEIVED ===");
    console.log("Product ID:", id);
    console.log("Body colors:", body.colors);
    console.log("Body sizes:", body.sizes);
    console.log(
      "Body colors type:",
      typeof body.colors,
      Array.isArray(body.colors)
    );
    console.log("Body colors length:", body.colors?.length);
    console.log("Full body:", JSON.stringify(body, null, 2));
    console.log("=== END API RECEIVED ===");

    // Explicitly set all fields including arrays
    const updateData = {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      stock: body.stock,
      images: body.images,
      sizes: body.sizes || [],
      colors: body.colors || [],
    };

    console.log("=== UPDATE DATA ===");
    console.log("updateData.colors:", updateData.colors);
    console.log("updateData.sizes:", updateData.sizes);
    console.log("=== END UPDATE DATA ===");

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("=== AFTER UPDATE ===");
    console.log("Product colors:", product.colors);
    console.log("Product sizes:", product.sizes);
    console.log("Full product:", JSON.stringify(product, null, 2));
    console.log("=== END AFTER UPDATE ===");

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        await deleteImage(image.public_id);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
