"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp } from "lucide-react";

interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export default function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.topProducts.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
        <div className="text-center py-8 text-gray-500">No sales data yet</div>
      </div>
    );
  }

  const maxRevenue = Math.max(...products.map((p) => p.revenue));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Top Selling Products
        </h2>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => {
          const percentage = (product.revenue / maxRevenue) * 100;
          return (
            <div key={product.productId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.quantity} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-sm">
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
