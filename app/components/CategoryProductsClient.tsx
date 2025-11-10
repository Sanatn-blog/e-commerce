"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
}

interface CategoryProductsClientProps {
  initialProducts: Product[];
  category: string;
  subcategories: string[];
  ringColor?: string;
}

export default function CategoryProductsClient({
  initialProducts,
  category,
  subcategories,
  ringColor = "blue",
}: CategoryProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(false);

  // Filter subcategories to only show those that exist in products
  const existingSubcategories = subcategories.filter((sub) =>
    initialProducts.some(
      (product) => product.subcategory?.toLowerCase() === sub.toLowerCase()
    )
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category,
        });

        if (selectedCategory !== "all") {
          params.append("subcategory", selectedCategory);
        }

        if (sortBy !== "featured") {
          params.append("sortBy", sortBy);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          const formattedProducts = data.products.map(
            (product: {
              _id: string;
              name: string;
              price: number;
              originalPrice?: number;
              images?: Array<{ url: string }>;
              category: string;
              subcategory?: string;
            }) => ({
              id: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images?.[0]?.url || "/placeholder.jpg",
              category: product.category,
              subcategory: product.subcategory,
              rating: 4.5,
              reviews: 0,
            })
          );
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, selectedCategory, sortBy]);

  return (
    <main className="grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{products.length}</span>{" "}
            products
          </p>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${ringColor}-500 text-gray-700`}
            >
              <option value="all">All Categories</option>
              {existingSubcategories.map((sub) => (
                <option key={sub} value={sub.toLowerCase()}>
                  {sub}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${ringColor}-500 text-gray-700`}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${ringColor}-600`}
            ></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
