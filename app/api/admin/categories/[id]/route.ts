import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id)
      .populate("parentCategory", "name")
      .lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        _id: category._id.toString(),
        parentCategory: category.parentCategory
          ? {
              _id: category.parentCategory._id.toString(),
              name: category.parentCategory.name,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
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

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
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

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        _id: category._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Convert empty string to null for parentCategory
    if (body.parentCategory === "") {
      body.parentCategory = null;
    }

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        _id: category._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
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

    const hasChildren = await Category.findOne({ parentCategory: id });
    if (hasChildren) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with subcategories",
        },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
