import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const accessoriesProducts = [
  {
    id: 601,
    name: "Designer Sunglasses",
    price: 149,
    originalPrice: 220,
    image: "/products/sunglasses.jpg",
    category: "Eyewear",
    rating: 4.8,
    reviews: 345,
  },
  {
    id: 602,
    name: "Leather Watch Strap",
    price: 29,
    image: "/products/watch-strap.jpg",
    category: "Watch Accessories",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 603,
    name: "Silk Scarf",
    price: 45,
    originalPrice: 65,
    image: "/products/scarf.jpg",
    category: "Scarves",
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 604,
    name: "Crossbody Bag",
    price: 89,
    image: "/products/crossbody.jpg",
    category: "Bags",
    rating: 4.9,
    reviews: 456,
  },
  {
    id: 605,
    name: "Gold Hoop Earrings",
    price: 39,
    originalPrice: 55,
    image: "/products/earrings.jpg",
    category: "Jewelry",
    rating: 4.8,
    reviews: 567,
  },
  {
    id: 606,
    name: "Baseball Cap",
    price: 25,
    image: "/products/baseball-cap.jpg",
    category: "Hats",
    rating: 4.5,
    reviews: 289,
  },
  {
    id: 607,
    name: "Leather Gloves",
    price: 59,
    originalPrice: 80,
    image: "/products/gloves.jpg",
    category: "Winter Accessories",
    rating: 4.7,
    reviews: 198,
  },
  {
    id: 608,
    name: "Phone Case",
    price: 19,
    image: "/products/phone-case.jpg",
    category: "Tech Accessories",
    rating: 4.6,
    reviews: 723,
  },
];

export default function Accessories() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessories</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
            Complete your look with our stunning collection of accessories. The
            perfect finishing touch to any outfit.
          </p>
        </div>
      </div>

      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {accessoriesProducts.length}
              </span>{" "}
              products
            </p>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Categories</option>
                <option>Bags</option>
                <option>Jewelry</option>
                <option>Eyewear</option>
                <option>Hats</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessoriesProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
