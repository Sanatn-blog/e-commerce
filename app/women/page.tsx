import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const womenProducts = [
  {
    id: 301,
    name: "Floral Summer Dress",
    price: 79,
    originalPrice: 110,
    image: "/products/women-dress.jpg",
    category: "Dresses",
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 302,
    name: "High-Waisted Jeans",
    price: 69,
    image: "/products/women-jeans.jpg",
    category: "Denim",
    rating: 4.7,
    reviews: 456,
  },
  {
    id: 303,
    name: "Silk Blouse",
    price: 59,
    originalPrice: 85,
    image: "/products/women-blouse.jpg",
    category: "Tops",
    rating: 4.9,
    reviews: 289,
  },
  {
    id: 304,
    name: "Leather Handbag",
    price: 129,
    image: "/products/women-handbag.jpg",
    category: "Bags",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 305,
    name: "Ankle Boots",
    price: 99,
    originalPrice: 140,
    image: "/products/women-boots.jpg",
    category: "Footwear",
    rating: 4.6,
    reviews: 378,
  },
  {
    id: 306,
    name: "Cashmere Cardigan",
    price: 89,
    image: "/products/women-cardigan.jpg",
    category: "Knitwear",
    rating: 4.9,
    reviews: 167,
  },
  {
    id: 307,
    name: "Pleated Midi Skirt",
    price: 55,
    originalPrice: 75,
    image: "/products/women-skirt.jpg",
    category: "Skirts",
    rating: 4.7,
    reviews: 298,
  },
  {
    id: 308,
    name: "Statement Necklace",
    price: 39,
    image: "/products/women-necklace.jpg",
    category: "Jewelry",
    rating: 4.5,
    reviews: 145,
  },
];

export default function Women() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

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

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{womenProducts.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700">
                <option>All Categories</option>
                <option>Dresses</option>
                <option>Tops</option>
                <option>Denim</option>
                <option>Accessories</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {womenProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
