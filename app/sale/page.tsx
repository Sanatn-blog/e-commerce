import SaleClient from "./SaleClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getSaleProducts() {
  try {
    await connectDB();
    // Get products that have originalPrice set (indicating they're on sale)
    const products = await Product.find({
      originalPrice: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || "/placeholder.jpg",
      category: product.category,
      rating: 4.5,
      reviews: 0,
    }));
  } catch (error) {
    console.error("Error fetching sale products:", error);
    return [];
  }
}

export default async function Sale() {
  const saleProducts = await getSaleProducts();
  return <SaleClient products={saleProducts} />;
}
