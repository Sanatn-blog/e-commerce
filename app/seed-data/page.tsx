"use client";

import { useState } from "react";

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const seedDatabase = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || "Failed to seed database");
      }
    } catch (err) {
      setError("Error connecting to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    if (!confirm("Are you sure you want to delete all products?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/seed", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError("Failed to clear database");
      }
    } catch (err) {
      setError("Error connecting to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Seeding Tool
          </h1>
          <p className="text-gray-600 mb-8">
            Add test products to your database for development and testing
          </p>

          <div className="space-y-4">
            <button
              onClick={seedDatabase}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Seed Database with Test Products"}
            </button>

            <button
              onClick={clearDatabase}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Clear All Products"}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Success!</h3>
              <p className="text-green-700 mb-4">{result.message}</p>

              {result.summary && (
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Summary:</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>Total Products: {result.summary.total}</li>
                    <li>Women's Products: {result.summary.womens}</li>
                    <li>Men's Products: {result.summary.mens}</li>
                    <li>Kids' Products: {result.summary.kids}</li>
                    <li>New Arrivals: {result.summary.newArrivals}</li>
                    <li>On Sale: {result.summary.onSale}</li>
                  </ul>
                </div>
              )}

              {result.deletedCount !== undefined && (
                <div className="bg-white rounded p-4 mb-4">
                  <p className="text-gray-700">
                    Deleted {result.deletedCount} products
                  </p>
                </div>
              )}

              {result.products && result.products.length > 0 && (
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Created Products:
                  </h4>
                  <div className="max-h-64 overflow-y-auto">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {result.products.map((product: any) => (
                        <li key={product.id} className="border-b pb-1">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-gray-500 ml-2">
                            ({product.category})
                          </span>
                          <span className="text-green-600 ml-2">
                            ${product.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-green-700 text-sm">
                  ✓ You can now visit the{" "}
                  <a href="/women" className="underline font-semibold">
                    Women's page
                  </a>{" "}
                  or{" "}
                  <a href="/men" className="underline font-semibold">
                    Men's page
                  </a>{" "}
                  to see the products!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">ℹ️ Information</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>
              • This will create 17 test products (7 women's, 6 men's, 5 kids')
            </li>
            <li>• Products include images from Unsplash</li>
            <li>• All products have sizes, colors, and stock information</li>
            <li>
              • Some products are marked as "New Arrivals" (created recently)
            </li>
            <li>• All products have discounts to appear in "Sale" section</li>
            <li>
              • If products already exist, you'll need to clear them first
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
