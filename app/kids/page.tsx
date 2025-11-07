import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const kidsProducts = [
  {
    id: 401,
    name: "Cartoon Print T-Shirt",
    price: 19,
    originalPrice: 29,
    image: "/products/kids-tshirt.jpg",
    category: "Tops",
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 402,
    name: "Denim Overalls",
    price: 39,
    image: "/products/kids-overalls.jpg",
    category: "Bottoms",
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 403,
    name: "Colorful Sneakers",
    price: 45,
    originalPrice: 60,
    image: "/products/kids-sneakers.jpg",
    category: "Footwear",
    rating: 4.6,
    reviews: 312,
  },
  {
    id: 404,
    name: "Hooded Jacket",
    price: 49,
    image: "/products/kids-jacket.jpg",
    category: "Outerwear",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 405,
    name: "Cotton Shorts Set",
    price: 29,
    originalPrice: 40,
    image: "/products/kids-shorts.jpg",
    category: "Sets",
    rating: 4.5,
    reviews: 267,
  },
  {
    id: 406,
    name: "School Backpack",
    price: 35,
    image: "/products/kids-backpack.jpg",
    category: "Accessories",
    rating: 4.8,
    reviews: 421,
  },
  {
    id: 407,
    name: "Printed Dress",
    price: 34,
    originalPrice: 48,
    image: "/products/kids-dress.jpg",
    category: "Dresses",
    rating: 4.7,
    reviews: 198,
  },
  {
    id: 408,
    name: "Sports Cap",
    price: 15,
    image: "/products/kids-cap.jpg",
    category: "Accessories",
    rating: 4.6,
    reviews: 145,
  },
];

export default function Kids() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

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

      <Footer />
    </div>
  );
}
