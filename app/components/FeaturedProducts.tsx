import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: {
    public_id: string;
    url: string;
  }[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  createdAt: string;
  updatedAt: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          No products available yet. Add products from the admin panel.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
        <a
          href="/products"
          className="text-rose-600 hover:text-rose-700 font-medium"
        >
          View All →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.images[0]?.url || ""}
            category={product.category}
            rating={4.5}
            reviews={0}
          />
        ))}
      </div>
    </section>
  );
}
