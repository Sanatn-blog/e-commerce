import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const shoesProducts = [
  {
    id: 501,
    name: "Running Shoes Pro",
    price: 119,
    originalPrice: 160,
    image: "/products/running-shoes.jpg",
    category: "Athletic",
    rating: 4.8,
    reviews: 567,
  },
  {
    id: 502,
    name: "Classic White Sneakers",
    price: 79,
    image: "/products/white-sneakers.jpg",
    category: "Casual",
    rating: 4.7,
    reviews: 892,
  },
  {
    id: 503,
    name: "Leather Loafers",
    price: 99,
    originalPrice: 135,
    image: "/products/loafers.jpg",
    category: "Formal",
    rating: 4.6,
    reviews: 234,
  },
  {
    id: 504,
    name: "High-Top Basketball Shoes",
    price: 139,
    image: "/products/basketball-shoes.jpg",
    category: "Sports",
    rating: 4.9,
    reviews: 421,
  },
  {
    id: 505,
    name: "Suede Chelsea Boots",
    price: 149,
    originalPrice: 199,
    image: "/products/chelsea-boots.jpg",
    category: "Boots",
    rating: 4.8,
    reviews: 312,
  },
  {
    id: 506,
    name: "Canvas Slip-Ons",
    price: 49,
    image: "/products/slip-ons.jpg",
    category: "Casual",
    rating: 4.5,
    reviews: 678,
  },
  {
    id: 507,
    name: "Hiking Boots",
    price: 129,
    originalPrice: 170,
    image: "/products/hiking-boots.jpg",
    category: "Outdoor",
    rating: 4.7,
    reviews: 289,
  },
  {
    id: 508,
    name: "Summer Sandals",
    price: 39,
    image: "/products/sandals.jpg",
    category: "Casual",
    rating: 4.6,
    reviews: 445,
  },
];

export default function Shoes() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shoes Collection
          </h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl">
            Step into comfort and style. From athletic to casual, find the
            perfect pair for every occasion.
          </p>
        </div>
      </div>

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{shoesProducts.length}</span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Categories</option>
                <option>Athletic</option>
                <option>Casual</option>
                <option>Formal</option>
                <option>Boots</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shoesProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
