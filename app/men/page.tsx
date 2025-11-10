import CategoryProductsClient from "../components/CategoryProductsClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getMenProducts() {
  try {
    await connectDB();
    const products = await Product.find({ category: "mens-clothing" })
      .sort({ createdAt: -1 })
      .lean();
    return products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || "/placeholder.jpg",
      category: product.category,
      subcategory: product.subcategory,
      rating: 4.5,
      reviews: 0,
    }));
  } catch (error) {
    console.error("Error fetching men products:", error);
    return [];
  }
}

export default async function Men() {
  const menProducts = await getMenProducts();
  return (
    <>
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Men&apos;s Collection
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            Elevate your style with our curated selection of men&apos;s fashion.
            From casual to formal, find everything you need.
          </p>
        </div>
      </div>

      <CategoryProductsClient
        initialProducts={menProducts}
        category="mens-clothing"
        subcategories={["Shirts", "Pants", "Outerwear", "Footwear"]}
        ringColor="blue"
      />
    </>
  );
}
