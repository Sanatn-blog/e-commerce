"use client";

import { useState, useEffect } from "react";
import { Eye, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  items: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      alert(err.message || "Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 text-lg">No orders found</p>
        <p className="text-gray-500 text-sm mt-2">
          Orders will appear here once customers make purchases
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          All Orders ({orders.length})
        </h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Order Number
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Items
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                Payment
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {order.customer.phone}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {order.items}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                  ₹{order.total.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  <div className="text-xs">
                    <div className="capitalize">{order.paymentMethod}</div>
                    <div
                      className={`${
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                      statusColors[order.status]
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
