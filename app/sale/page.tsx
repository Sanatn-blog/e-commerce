import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const saleProducts = [
  {
    id: 701,
    name: "Winter Coat",
    price: 99,
    originalPrice: 199,
    image: "/products/winter-coat.jpg",
    category: "Outerwear",
    rating: 4.8,
    reviews: 456,
  },
  {
    id: 702,
    name: "Designer Jeans",
    price: 49,
    originalPrice: 89,
    image: "/products/designer-jeans.jpg",
    category: "Denim",
    rating: 4.7,
    reviews: 678,
  },
  {
    id: 703,
    name: "Leather Jacket",
    price: 149,
    originalPrice: 299,
    image: "/products/leather-jacket.jpg",
    category: "Outerwear",
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 704,
    name: "Formal Dress Shoes",
    price: 79,
    originalPrice: 140,
    image: "/products/dress-shoes.jpg",
    category: "Footwear",
    rating: 4.6,
    reviews: 312,
  },
  {
    id: 705,
    name: "Cashmere Sweater",
    price: 69,
    originalPrice: 120,
    image: "/products/cashmere-sweater.jpg",
    category: "Knitwear",
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 706,
    name: "Designer Handbag",
    price: 159,
    originalPrice: 320,
    image: "/products/designer-handbag.jpg",
    category: "Bags",
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 707,
    name: "Smart Watch",
    price: 199,
    originalPrice: 349,
    image: "/products/smart-watch.jpg",
    category: "Electronics",
    rating: 4.7,
    reviews: 892,
  },
  {
    id: 708,
    name: "Sunglasses Collection",
    price: 89,
    originalPrice: 180,
    image: "/products/sunglasses-sale.jpg",
    category: "Accessories",
    rating: 4.8,
    reviews: 421,
  },
];

export default function Sale() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

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

      <Footer />
    </div>
  );
}
