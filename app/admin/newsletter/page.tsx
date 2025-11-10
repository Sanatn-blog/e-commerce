"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Trash2, ToggleLeft, ToggleRight, Download } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/newsletter");
      const data = await response.json();

      if (response.ok) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
      } else {
        toast.error(data.error || "Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const response = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Subscriber removed successfully");
        fetchSubscribers();
      } else {
        toast.error(data.error || "Failed to remove subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to remove subscriber");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchSubscribers();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Email", "Subscribed At", "Status"],
      ...subscribers.map((sub) => [
        sub.email,
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.isActive ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading subscribers...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Newsletter Subscribers
            </h1>
            <p className="text-gray-600">
              Manage your newsletter subscribers and send updates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Subscribers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ToggleRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inactive</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {stats.inactive}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <ToggleLeft className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-900 flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No subscribers found matching your search"
                          : "No subscribers yet"}
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscriber.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                subscriber._id,
                                subscriber.isActive
                              )
                            }
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title={
                              subscriber.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {subscriber.isActive ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
