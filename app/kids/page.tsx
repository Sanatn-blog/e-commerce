import ProductCard from "../components/ProductCard";
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

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{kidsProducts.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700">
                <option>All Categories</option>
                <option>Tops</option>
                <option>Bottoms</option>
                <option>Outerwear</option>
                <option>Accessories</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kidsProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
