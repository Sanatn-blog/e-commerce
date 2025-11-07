import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePageClient from "./components/HomePageClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // Convert MongoDB documents to plain objects and serialize dates
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <HomePageClient products={products} />
      <Footer />
    </div>
  );
}
