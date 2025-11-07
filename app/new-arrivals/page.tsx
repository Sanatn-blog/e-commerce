import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// Sample new arrivals data
const newArrivals = [
  {
    id: 101,
    name: "Premium Wireless Headphones",
    price: 199,
    originalPrice: 249,
    image: "/products/headphones.jpg",
    category: "Electronics",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 102,
    name: "Minimalist Leather Wallet",
    price: 49,
    image: "/products/wallet.jpg",
    category: "Accessories",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 103,
    name: "Smart Fitness Watch",
    price: 299,
    originalPrice: 399,
    image: "/products/watch.jpg",
    category: "Electronics",
    rating: 4.7,
    reviews: 203,
  },
  {
    id: 104,
    name: "Organic Cotton T-Shirt",
    price: 29,
    image: "/products/tshirt.jpg",
    category: "Clothing",
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 105,
    name: "Stainless Steel Water Bottle",
    price: 35,
    originalPrice: 45,
    image: "/products/bottle.jpg",
    category: "Lifestyle",
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 106,
    name: "Wireless Charging Pad",
    price: 39,
    image: "/products/charger.jpg",
    category: "Electronics",
    rating: 4.4,
    reviews: 78,
  },
  {
    id: 107,
    name: "Canvas Backpack",
    price: 79,
    originalPrice: 99,
    image: "/products/backpack.jpg",
    category: "Bags",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 108,
    name: "Bluetooth Speaker",
    price: 89,
    image: "/products/speaker.jpg",
    category: "Electronics",
    rating: 4.6,
    reviews: 267,
  },
];

export default function NewArrivals() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
          <p className="text-lg md:text-xl text-rose-100 max-w-2xl">
            Discover our latest collection of trending products. Fresh styles,
            new designs, and exclusive items just for you.
          </p>
        </div>
      </div>

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{newArrivals.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Lifestyle</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
