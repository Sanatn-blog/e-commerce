import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import FeaturedProducts from "./components/FeaturedProducts";
import PromoSection from "./components/PromoSection";
import Features from "./components/Features";
import Newsletter from "./components/Newsletter";
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
      <Hero />
      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGrid />
          <FeaturedProducts products={products} />
          <PromoSection />
          <Features />
          <Newsletter />
        </div>
      </main>
      <Footer />
    </div>
  );
}
