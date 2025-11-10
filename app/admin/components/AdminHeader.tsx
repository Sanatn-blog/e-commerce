"use client";

import {
  Bell,
  Search,
  User,
  LogOut,
  Clock,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

interface Notification {
  _id: string;
  type: "order" | "stock" | "delivery" | "product" | "user" | "payment";
  title: string;
  message: string;
  unread: boolean;
  createdAt: string;
}

export default function AdminHeader() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

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

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=20");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unread: false }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {currentTime}
            </span>
          </div>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all read
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const {
                        icon: Icon,
                        color,
                        bgColor,
                      } = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification._id}
                          onClick={() =>
                            notification.unread && markAsRead(notification._id)
                          }
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.unread ? "bg-blue-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${bgColor}`}>
                              <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-semibold text-gray-900">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@store.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
