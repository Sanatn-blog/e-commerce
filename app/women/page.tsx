import CategoryProductsClient from "../components/CategoryProductsClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getWomenProducts() {
  try {
    await connectDB();
    const products = await Product.find({ category: "womens-clothing" })
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
    console.error("Error fetching women products:", error);
    return [];
  }
}

export default async function Women() {
  const womenProducts = await getWomenProducts();
  return (
    <>
      <div className="bg-linear-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Women&apos;s Collection
          </h1>
          <p className="text-lg md:text-xl text-pink-100 max-w-2xl">
            Discover the latest trends in women&apos;s fashion. Elegant,
            stylish, and designed for the modern woman.
          </p>
        </div>
      </div>

      <CategoryProductsClient
        initialProducts={womenProducts}
        category="womens-clothing"
        subcategories={["Dresses", "Tops", "Denim", "Accessories"]}
        ringColor="pink"
      />
    </>
  );
}
