"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Package,
  User,
  Filter,
  Search,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

interface Notification {
  _id: string;
  type: "order" | "stock" | "delivery" | "product" | "user" | "payment";
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
  unread: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return {
          icon: ShoppingCart,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "stock":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        };
      case "delivery":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "product":
        return {
          icon: Package,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        };
      case "user":
        return {
          icon: User,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
        };
      case "payment":
        return {
          icon: ShoppingCart,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        };
      default:
        return { icon: Bell, color: "text-gray-600", bgColor: "bg-gray-50" };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setFilteredNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (notification.unread) {
      try {
        await fetch(`/api/admin/notifications/${notification._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unread: false }),
        });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Navigate to related page if relatedId exists
    if (notification.relatedId && notification.relatedModel) {
      if (notification.relatedModel === "Order") {
        router.push(`/admin/orders?orderId=${notification.relatedId}`);
      } else if (notification.relatedModel === "Product") {
        router.push(`/admin/products?productId=${notification.relatedId}`);
      } else if (notification.relatedModel === "User") {
        router.push(`/admin/users?userId=${notification.relatedId}`);
      }
    }

    // Refresh notifications
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications/mark-all-read", {
        method: "POST",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    if (filter !== "all") {
      if (filter === "unread") {
        filtered = notifications.filter((n) => n.unread);
      } else {
        filtered = notifications.filter((n) => n.type === filter);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [filter, searchQuery, notifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Manage and view all your notifications in one place
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread</option>
                      <option value="order">Orders</option>
                      <option value="stock">Stock</option>
                      <option value="delivery">Delivery</option>
                      <option value="product">Products</option>
                      <option value="user">Users</option>
                      <option value="payment">Payments</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-gray-900 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                    />
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Mark All as Read ({unreadCount})
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No notifications found</p>
                  <p className="text-sm mt-2">
                    {searchQuery || filter !== "all"
                      ? "Try adjusting your filters"
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const {
                    icon: Icon,
                    color,
                    bgColor,
                  } = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.unread ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${bgColor} shrink-0`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-base font-semibold text-gray-900">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <p className="text-xs text-gray-400">
                                  {getTimeAgo(notification.createdAt)}
                                </p>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {notification.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
