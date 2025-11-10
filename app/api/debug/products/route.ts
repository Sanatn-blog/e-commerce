import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const allProducts = await Product.find({}).lean();
    const categories = [...new Set(allProducts.map((p: any) => p.category))];

    const categoryCounts = categories.map((cat) => ({
      category: cat,
      count: allProducts.filter((p: any) => p.category === cat).length,
    }));

    return NextResponse.json({
      success: true,
      totalProducts: allProducts.length,
      categories: categoryCounts,
      products: allProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        price: p.price,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
