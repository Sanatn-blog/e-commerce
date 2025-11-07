import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ order: 1, name: 1 });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const existingCategory = await Category.findOne({
      $or: [{ name: body.name }, { slug: body.slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category name or slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create(body);

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
