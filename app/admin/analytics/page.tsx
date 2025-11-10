"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Activity,
} from "lucide-react";

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
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  statusBreakdown: Record<string, number>;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-600">Loading analytics...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="text-red-600">Failed to load analytics</div>
          </main>
        </div>
      </div>
    );
  }

  const { overview, monthlyRevenue, statusBreakdown, topProducts } = analytics;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`$${overview.totalRevenue.toLocaleString()}`}
              subtitle={`Completed: $${overview.completedRevenue.toLocaleString()}`}
              color="bg-green-500"
            />
            <StatCard
              icon={ShoppingCart}
              title="Total Orders"
              value={overview.totalOrders.toString()}
              subtitle={`Avg: $${overview.avgOrderValue.toFixed(2)}`}
              color="bg-blue-500"
            />
            <StatCard
              icon={Users}
              title="Total Customers"
              value={overview.totalCustomers.toString()}
              subtitle={`New this month: ${overview.newCustomersThisMonth}`}
              color="bg-purple-500"
            />
            <StatCard
              icon={Package}
              title="Total Products"
              value={overview.totalProducts.toString()}
              subtitle="In catalog"
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-900 text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Monthly Revenue (Last 12 Months)
              </h2>
              <div className="space-y-3">
                {monthlyRevenue.slice(-6).map((month, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">
                      {month.month}
                    </div>
                    <div className="flex-1 mx-4 relative">
                      <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              (month.revenue /
                                Math.max(
                                  ...monthlyRevenue.map((m) => m.revenue)
                                )) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs font-medium text-gray-700">
                          {month.orders} orders
                        </span>
                      </div>
                    </div>
                    <div className="w-32 text-right text-sm font-medium text-gray-900">
                      ${month.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-gray-900 text-xl font-semibold mb-4 flex items-center">
                <Activity className="text-gray-900 w-5 h-5 mr-2" />
                Order Status Breakdown
              </h2>
              <div className="space-y-4">
                {Object.entries(statusBreakdown).map(([status, count]) => {
                  const percentage = (count / overview.totalOrders) * 100;
                  const statusColors: Record<string, string> = {
                    Pending: "bg-yellow-500",
                    Processing: "bg-blue-500",
                    Shipped: "bg-indigo-500",
                    Delivered: "bg-green-500",
                    Cancelled: "bg-red-500",
                  };
                  return (
                    <div key={status}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`${
                            statusColors[status] || "bg-gray-500"
                          } h-full rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Top 10 Selling Products
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
