import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    // Search in name, description, and category
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .limit(10)
      .select("name price images category")
      .lean();

    // Serialize products
    const serializedProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      images:
        product.images?.map((img: { public_id: string; url: string }) => ({
          public_id: img.public_id,
          url: img.url,
        })) || [],
    }));

    return NextResponse.json({
      success: true,
      products: serializedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to search products" },
      { status: 500 }
    );
  }
}
