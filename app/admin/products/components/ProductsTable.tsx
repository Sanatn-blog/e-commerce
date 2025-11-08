"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: { public_id: string; url: string }[];
}

export default function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        console.log("Products fetched:", data.products);
        data.products.forEach((p: Product, i: number) => {
          console.log(`Product ${i} (${p.name}):`, {
            hasImages: !!p.images,
            imagesLength: p.images?.length,
            firstImage: p.images?.[0],
          });
        });
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">
          No products found. Add your first product!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Product
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Stock
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                    <span className="text-sm text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                  {product.category}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  ₹{product.price.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {product.stock}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/products/edit/${product._id}`)
                      }
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleting === product._id}
                      className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                      {deleting === product._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
