import ProductCard from "../components/ProductCard";

const menProducts = [
  {
    id: 201,
    name: "Classic Denim Jacket",
    price: 89,
    originalPrice: 120,
    image: "/products/men-jacket.jpg",
    category: "Outerwear",
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 202,
    name: "Slim Fit Chinos",
    price: 59,
    image: "/products/men-chinos.jpg",
    category: "Pants",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 203,
    name: "Cotton Polo Shirt",
    price: 39,
    originalPrice: 55,
    image: "/products/men-polo.jpg",
    category: "Shirts",
    rating: 4.6,
    reviews: 312,
  },
  {
    id: 204,
    name: "Leather Belt",
    price: 45,
    image: "/products/men-belt.jpg",
    category: "Accessories",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 205,
    name: "Casual Sneakers",
    price: 79,
    originalPrice: 99,
    image: "/products/men-sneakers.jpg",
    category: "Footwear",
    rating: 4.7,
    reviews: 421,
  },
  {
    id: 206,
    name: "Wool Sweater",
    price: 69,
    image: "/products/men-sweater.jpg",
    category: "Knitwear",
    rating: 4.9,
    reviews: 178,
  },
  {
    id: 207,
    name: "Oxford Dress Shirt",
    price: 49,
    originalPrice: 65,
    image: "/products/men-oxford.jpg",
    category: "Shirts",
    rating: 4.6,
    reviews: 267,
  },
  {
    id: 208,
    name: "Athletic Joggers",
    price: 55,
    image: "/products/men-joggers.jpg",
    category: "Activewear",
    rating: 4.5,
    reviews: 198,
  },
];

export default function Men() {
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
