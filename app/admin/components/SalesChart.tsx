"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export default function SalesChart() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"revenue" | "orders">("revenue");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const analytics = await response.json();
          setData(analytics.monthlyRevenue.slice(-6)); // Last 6 months
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
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const values = data.map((d) => (view === "revenue" ? d.revenue : d.orders));
  const maxValue = Math.max(...values, 1);

  // Calculate trend
  const firstHalf = values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const secondHalf = values.slice(3).reduce((a, b) => a + b, 0) / 3;
  const trend = secondHalf > firstHalf ? "up" : "down";
  const trendPercent =
    firstHalf > 0
      ? (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1)
      : "0";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
          <div className="flex items-center gap-2 mt-1">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "+" : ""}
              {trendPercent}% vs previous period
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("revenue")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              view === "revenue"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setView("orders")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              view === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Orders
          </button>
        </div>
      </div>
      <div className="flex items-end justify-between h-64 gap-3">
        {data.map((item, index) => {
          const value = view === "revenue" ? item.revenue : item.orders;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 group"
            >
              <div
                className="relative w-full flex items-end justify-center"
                style={{ height: "100%" }}
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative"
                  style={{
                    height: `${height}%`,
                    minHeight: value > 0 ? "8px" : "0",
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {view === "revenue"
                      ? `₹${value.toLocaleString("en-IN")}`
                      : `${value} orders`}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                {item.month.split(" ")[0]}
              </p>
              <p className="text-xs text-gray-500">
                {view === "revenue" ? `₹${(value / 1000).toFixed(1)}k` : value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
