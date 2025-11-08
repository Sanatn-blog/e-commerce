"use client";

import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Camera,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ImageCropModal from "../components/ImageCropModal";
import Link from "next/link";
import Image from "next/image";

interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { customer, loading, logout, refreshCustomer } = useAuth();
  const { success, error } = useToast();
  const { wishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!loading && !customer) {
      router.push("/login");
    }
  }, [customer, loading, router]);

  useEffect(() => {
    console.log("Customer state updated:", customer);
    if (customer?.image) {
      console.log("Profile image URL:", customer.image);
    } else {
      console.log("No profile image in customer state");
    }
  }, [customer]);

  useEffect(() => {
    if (activeSection === "orders" && orders.length === 0) {
      fetchOrders();
    } else if (activeSection === "addresses" && addresses.length === 0) {
      fetchAddresses();
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/customer/orders");
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch("/api/customer/addresses");
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/customer/addresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        success("Address deleted successfully");
        setAddresses(addresses.filter((addr) => addr._id !== id));
      } else {
        error("Failed to delete address");
      }
    } catch (err) {
      error("Failed to delete address");
    }
  };

  const handleSaveAddress = async (addressData: Partial<Address>) => {
    try {
      const url = editingAddress
        ? `/api/customer/addresses/${editingAddress._id}`
        : "/api/customer/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddressModal(false);
        setEditingAddress(null);
        fetchAddresses();
      } else {
        error("Failed to save address");
      }
    } catch (err) {
      error("Failed to save address");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setShowCropModal(false);
    setUploading(true);

    try {
      console.log("Uploading profile image...");
      const response = await fetch("/api/customer/upload-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: croppedImage }),
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (response.ok) {
        console.log(
          "Upload successful, image URL from API:",
          data.customer?.image
        );
        await refreshCustomer();
        console.log("Customer refresh completed");
        success("Profile image updated successfully!");
      } else {
        console.error("Upload failed:", data);
        error(data.error || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="grow py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  const getInitials = () => {
    if (customer.name) {
      return customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return customer.phone.slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="grow py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                <div className="relative">
                  {uploading ? (
                    <div className="w-16 h-16 rounded-full shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  ) : customer.image ? (
                    <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden relative">
                      <Image
                        key={customer.image}
                        src={`${customer.image}?t=${Date.now()}`}
                        alt={customer.name || "Profile"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onLoad={() =>
                          console.log(
                            "Image loaded successfully:",
                            customer.image
                          )
                        }
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            customer.image
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {customer.name || "User"}
                  </h2>
                  <p
                    className="text-sm text-gray-500 truncate"
                    title={customer.email || customer.phone}
                  >
                    {customer.email || customer.phone}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "profile"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveSection("orders")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "orders"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package size={20} />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveSection("wishlist")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "wishlist"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveSection("addresses")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "addresses"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin size={20} />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveSection("payment")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "payment"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Payment Methods</span>
                </button>
                <button
                  onClick={() => setActiveSection("settings")}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full ${
                    activeSection === "settings"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customer.name || "Not provided"}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customer.email || "Not provided"}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Section */}
            {activeSection === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  My Orders
                </h2>
                {loadingOrders ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-4"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                  {item.size && ` • Size: ${item.size}`}
                                  {item.color && ` • Color: ${item.color}`}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-gray-600">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Section */}
            {activeSection === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Addresses
                  </h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                    <span>Add New</span>
                  </button>
                </div>
                {loadingAddresses ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No addresses saved</p>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                          <div className="flex space-x-2 ml-auto">
                            <button
                              onClick={() => {
                                setEditingAddress(address);
                                setShowAddressModal(true);
                              }}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 mt-3">
                          {address.label}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.fullName}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {address.addressLine1}
                        </p>
                        {address.addressLine2 && (
                          <p className="text-sm text-gray-600">
                            {address.addressLine2}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Section */}
            {activeSection === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Wishlist
                  </h2>
                  <span className="text-sm text-gray-600">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                  </span>
                </div>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                    <button
                      onClick={() => router.push("/")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/product/${item._id}`}>
                          <div className="relative aspect-square bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/product/${item._id}`}>
                            <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => {
                                removeFromWishlist(item._id);
                                success("Removed from wishlist");
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove from wishlist"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <Link href={`/product/${item._id}`}>
                            <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                              View Product
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods Section */}
            {activeSection === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Methods
                </h2>
                <div className="text-center py-12">
                  <CreditCard
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-600">No payment methods saved</p>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Settings
                </h2>
                <div className="text-center py-12">
                  <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Settings coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      )}
      {showAddressModal && (
        <AddressModal
          address={editingAddress}
          onSave={handleSaveAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
        />
      )}
    </main>
  );
}

function AddressModal({
  address,
  onSave,
  onClose,
}: {
  address: Address | null;
  onSave: (data: Partial<Address>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    label: address?.label || "",
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "United States",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label (e.g., Home, Office)
              </label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine2: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                required
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Set as default address
                </span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
