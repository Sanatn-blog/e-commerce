import CategoryProductsClient from "../components/CategoryProductsClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getKidsProducts() {
  try {
    await connectDB();
    const products = await Product.find({ category: "kids" })
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
    console.error("Error fetching kids products:", error);
    return [];
  }
}

export default async function Kids() {
  const kidsProducts = await getKidsProducts();
  return (
    <>
      <div className="bg-linear-to-r from-orange-500 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kids&apos; Collection
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl">
            Fun, comfortable, and durable clothing for your little ones. Let
            them play in style!
          </p>
        </div>
      </div>

      <CategoryProductsClient
        initialProducts={kidsProducts}
        category="kids"
        subcategories={["Tops", "Bottoms", "Outerwear", "Accessories"]}
        ringColor="orange"
      />
    </>
  );
}
