"use client";

import { useState, useEffect } from "react";
import { PieChart } from "lucide-react";

interface StatusBreakdown {
  [key: string]: number;
}

const statusConfig: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  pending: { color: "#f59e0b", bgColor: "bg-yellow-500", label: "Pending" },
  processing: { color: "#3b82f6", bgColor: "bg-blue-500", label: "Processing" },
  shipped: { color: "#8b5cf6", bgColor: "bg-purple-500", label: "Shipped" },
  delivered: { color: "#10b981", bgColor: "bg-green-500", label: "Delivered" },
  cancelled: { color: "#ef4444", bgColor: "bg-red-500", label: "Cancelled" },
};

export default function OrderStatusChart() {
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setStatusBreakdown(data.statusBreakdown);
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
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const total = Object.values(statusBreakdown).reduce(
    (sum, count) => sum + count,
    0
  );

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
        <div className="text-center py-8 text-gray-500">No orders yet</div>
      </div>
    );
  }

  const statusData = Object.entries(statusBreakdown)
    .map(([status, count]) => ({
      status,
      count,
      percentage: (count / total) * 100,
      config: statusConfig[status.toLowerCase()] || statusConfig.pending,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Order Status Breakdown
        </h2>
      </div>

      <div className="space-y-4">
        {statusData.map((item) => (
          <div key={item.status} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${item.config.bgColor}`}
                ></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.config.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {item.count} orders
                </span>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`${item.config.bgColor} h-full rounded-full transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Total Orders
          </span>
          <span className="text-2xl font-bold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
}
