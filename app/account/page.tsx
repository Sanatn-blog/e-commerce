"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ImageCropModal from "../components/ImageCropModal";

export default function AccountPage() {
  const { customer, loading, logout, refreshCustomer } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !customer) {
      router.push("/login");
    }
  }, [customer, loading, router]);

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
      const response = await fetch("/api/customer/upload-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: croppedImage }),
      });

      if (response.ok) {
        await refreshCustomer();
        success("Profile image updated successfully!");
      } else {
        error("Failed to upload image. Please try again.");
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const profileImage = (customer as any).image || null;
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      ) : profileImage ? (
                        <img
                          src={profileImage}
                          alt={customer.name || "Profile"}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getInitials()
                      )}
                    </div>
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
                  <a
                    href="#profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#orders"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={20} />
                    <span>Orders</span>
                  </a>
                  <a
                    href="/wishlist"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </a>
                  <a
                    href="#addresses"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <MapPin size={20} />
                    <span>Addresses</span>
                  </a>
                  <a
                    href="#payment"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <CreditCard size={20} />
                    <span>Payment Methods</span>
                  </a>
                  <a
                    href="#settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </a>
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
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Edit
                  </button>
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

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                  <a
                    href="#orders"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </a>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div
                      key={order}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #ORD-{1000 + order}
                          </p>
                          <p className="text-sm text-gray-500">
                            Placed on Nov {order}, 2025
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">
                            Product Name
                          </p>
                          <p className="text-sm text-gray-500">Quantity: 1</p>
                        </div>
                        <p className="font-semibold text-gray-900">$99.99</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Saved Addresses
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Default
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        Edit
                      </button>
                    </div>
                    <p className="font-medium text-gray-900 mt-3">Home</p>
                    <p className="text-sm text-gray-600 mt-1">
                      123 Main Street
                    </p>
                    <p className="text-sm text-gray-600">New York, NY 10001</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500">Secondary</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        Edit
                      </button>
                    </div>
                    <p className="font-medium text-gray-900 mt-3">Office</p>
                    <p className="text-sm text-gray-600 mt-1">
                      456 Business Ave
                    </p>
                    <p className="text-sm text-gray-600">New York, NY 10002</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
