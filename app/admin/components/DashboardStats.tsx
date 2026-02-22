"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  IndianRupee,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    completedRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    avgOrderValue: number;
    newCustomersThisMonth: number;
  };
}

export default function DashboardStats() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${analytics.overview.totalRevenue.toLocaleString("en-IN")}`,
      subValue: `Completed: ₹${analytics.overview.completedRevenue.toLocaleString(
        "en-IN"
      )}`,
      icon: IndianRupee,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Orders",
      value: analytics.overview.totalOrders.toLocaleString(),
      subValue: `Avg: ₹${Math.round(
        analytics.overview.avgOrderValue
      ).toLocaleString("en-IN")}`,
      icon: ShoppingCart,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Total Customers",
      value: analytics.overview.totalCustomers.toLocaleString(),
      subValue: `New this month: ${analytics.overview.newCustomersThisMonth}`,
      icon: Users,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Total Products",
      value: analytics.overview.totalProducts.toLocaleString(),
      subValue: "Active in catalog",
      icon: Package,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.subValue}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
