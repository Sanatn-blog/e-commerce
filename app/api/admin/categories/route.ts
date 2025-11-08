import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories: categories.map((cat) => ({
        ...cat,
        _id: cat._id.toString(),
        parentCategory: cat.parentCategory
          ? {
              _id: cat.parentCategory._id.toString(),
              name: cat.parentCategory.name,
            }
          : undefined,
      })),
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

    // Convert empty string to null for parentCategory
    if (body.parentCategory === "") {
      body.parentCategory = null;
    }

    const category = await Category.create(body);
    const plainCategory = category.toObject();

    return NextResponse.json({
      success: true,
      category: {
        ...plainCategory,
        _id: plainCategory._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
