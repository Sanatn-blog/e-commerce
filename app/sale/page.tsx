import ProductCard from "../components/ProductCard";
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
  return (
    <>
      <div className="bg-linear-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sale - Up to 50% Off
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-2xl">
            Don&apos;t miss out on incredible deals! Limited time offers on your
            favorite products.
          </p>
        </div>
      </div>

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{saleProducts.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700">
                <option>All Categories</option>
                <option>Clothing</option>
                <option>Footwear</option>
                <option>Accessories</option>
                <option>Electronics</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700">
                <option>Sort by: Biggest Discount</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
