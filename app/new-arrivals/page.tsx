import NewArrivalsClient from "./NewArrivalsClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getNewArrivals() {
  try {
    await connectDB();
    // Get products from last 30 days, sorted by newest first
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const products = await Product.find({
      createdAt: { $gte: thirtyDaysAgo },
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
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export default async function NewArrivals() {
  const newArrivals = await getNewArrivals();
  return <NewArrivalsClient products={newArrivals} />;
}
