import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { notifyNewProduct } from "@/lib/notificationHelper";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const sortBy = searchParams.get("sortBy");

    // Build query
    const query: Record<string, any> = {};
    if (category) query.category = category;
    if (subcategory) {
      query.subcategory = { $regex: new RegExp(`^${subcategory}$`, "i") };
    }

    // Build sort
    let sort: { [key: string]: 1 | -1 } = { createdAt: -1 };
    if (sortBy === "price-asc") sort = { price: 1 };
    else if (sortBy === "price-desc") sort = { price: -1 };
    else if (sortBy === "rating") sort = { rating: -1 };

    const products = await Product.find(query).sort(sort);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    console.log("Creating product with data:", JSON.stringify(body, null, 2));

    const product = await Product.create(body);

    // Create notification for new product
    await notifyNewProduct(String(product._id), product.name);

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      console.error("Validation error details:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
