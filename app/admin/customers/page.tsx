"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  X,
  ShoppingBag,
  MapPin,
  Package,
} from "lucide-react";

interface Customer {
  _id: string;
  phone: string;
  name?: string;
  email?: string;
  image?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: number;
}

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface CustomerDetails {
  customer: Customer;
  orders: Order[];
  addresses: Address[];
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      const data = await response.json();

      if (response.ok) {
        setCustomers(data.customers);
      } else {
        setError(data.error || "Failed to fetch customers");
      }
    } catch (err) {
      setError("An error occurred while fetching customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchCustomerDetails = async (customerId: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`);
      const data = await response.json();

      if (response.ok) {
        setCustomerDetails(data);
      } else {
        console.error("Failed to fetch customer details");
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDetails(customer._id);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchQuery === "" ||
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer._id.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && customer.isVerified) ||
      (statusFilter === "unverified" && !customer.isVerified);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-2">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
          </div>

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[250px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-gray-900 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-gray-900 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>

                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-lg">
                            No customers match your filters
                          </p>
                          <p className="text-sm mt-2">
                            Try adjusting your search or filter criteria
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10">
                                {customer.image ? (
                                  <Image
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={customer.image}
                                    alt={customer.name || "Customer"}
                                    width={40}
                                    height={40}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {customer._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {customer.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {customer.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {customer.isVerified ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(customer.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.lastLogin
                              ? formatDate(customer.lastLogin)
                              : "Never"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewCustomer(customer)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded"
                              title="View customer details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Customer Details
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loadingDetails ? (
                  <div className="p-12 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                        {selectedCustomer.image ? (
                          <Image
                            className="h-20 w-20 rounded-full object-cover"
                            src={selectedCustomer.image}
                            alt={selectedCustomer.name || "Customer"}
                            width={80}
                            height={80}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-10 w-10 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">
                          {selectedCustomer.name || "N/A"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ID: {selectedCustomer._id}
                        </p>
                        {selectedCustomer.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">
                              {selectedCustomer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">
                              {selectedCustomer.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Account Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Joined</p>
                            <p className="text-gray-900">
                              {formatDate(selectedCustomer.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Last Login</p>
                            <p className="text-gray-900">
                              {selectedCustomer.lastLogin
                                ? formatDate(selectedCustomer.lastLogin)
                                : "Never"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {customerDetails && (
                      <>
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Order Statistics
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Total Orders
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {customerDetails.stats.totalOrders}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Total Spent
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                ₹{customerDetails.stats.totalSpent.toFixed(0)}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600">Avg Order</p>
                              <p className="text-2xl font-bold text-purple-600">
                                ₹
                                {customerDetails.stats.averageOrderValue.toFixed(
                                  0
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Recent Orders ({customerDetails.orders.length})
                          </h4>
                          {customerDetails.orders.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4">
                              No orders yet
                            </p>
                          ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {customerDetails.orders.map((order) => (
                                <div
                                  key={order._id}
                                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {order.orderNumber}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {order.items} item
                                        {order.items !== 1 ? "s" : ""} •{" "}
                                        {formatDate(order.createdAt)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-gray-900">
                                        ₹{order.total.toFixed(0)}
                                      </p>
                                      <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                          statusColors[order.status] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            Saved Addresses ({customerDetails.addresses.length})
                          </h4>
                          {customerDetails.addresses.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4">
                              No saved addresses
                            </p>
                          ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {customerDetails.addresses.map((address) => (
                                <div
                                  key={address._id}
                                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900">
                                          {address.fullName}
                                        </p>
                                        {address.isDefault && (
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {address.phone}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {address.addressLine1}
                                        {address.addressLine2 &&
                                          `, ${address.addressLine2}`}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {address.city}, {address.state} -{" "}
                                        {address.zipCode}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
