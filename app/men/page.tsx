import ProductCard from "../components/ProductCard";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getMenProducts() {
  try {
    await connectDB();
    const products = await Product.find({ category: "men" })
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

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{menProducts.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                <option>All Categories</option>
                <option>Shirts</option>
                <option>Pants</option>
                <option>Outerwear</option>
                <option>Footwear</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
