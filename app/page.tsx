import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePageClient from "./components/HomePageClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

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

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    return categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      order: category.order,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <HomePageClient products={products} categories={categories} />
      <Footer />
    </div>
  );
}
