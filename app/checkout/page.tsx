"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Lock, User, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
  });

  const subtotal = cartTotal;
  const shipping = subtotal >= 500 ? 0 : 40.0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    // Check if user is logged in
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.customer) {
          setIsLoggedIn(true);
          setCustomerDetails((prev) => ({
            ...prev,
            name: data.customer.name || "",
            email: data.customer.email || "",
            phone: data.customer.phone || "",
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails({
      ...customerDetails,
      [name]: value,
    });
    setError("");

    // Auto-fill city and state when PIN code is entered (6 digits for India)
    if (name === "zipCode" && value.length === 6) {
      lookupPinCode(value);
    }
  };

  const lookupPinCode = async (pinCode: string) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      if (response.ok) {
        const data = await response.json();
        if (
          data &&
          data[0]?.Status === "Success" &&
          data[0]?.PostOffice?.length > 0
        ) {
          const postOffice = data[0].PostOffice[0];
          setCustomerDetails((prev) => ({
            ...prev,
            city: postOffice.District || "",
            state: postOffice.State || "",
          }));
        }
      }
    } catch (error) {
      // Silently fail - user can still enter manually
      console.log("PIN code lookup failed:", error);
    }
  };

  const validateForm = () => {
    if (!customerDetails.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!customerDetails.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!customerDetails.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!customerDetails.address.trim()) {
      setError("Address is required");
      return false;
    }
    if (!customerDetails.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!customerDetails.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!customerDetails.zipCode.trim()) {
      setError("PIN code is required");
      return false;
    }
    if (!/^\d{6}$/.test(customerDetails.zipCode)) {
      setError("Please enter a valid 6-digit PIN code");
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customerDetails.phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setShowOtpModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: customerDetails.phone,
          otp,
          name: customerDetails.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      // Update customer profile with additional details
      await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerDetails.email,
          address: customerDetails.address,
          address2: customerDetails.address2,
          city: customerDetails.city,
          state: customerDetails.state,
          zipCode: customerDetails.zipCode,
          landmark: customerDetails.landmark,
        }),
      });

      // Store checkout details in session storage
      sessionStorage.setItem(
        "checkoutDetails",
        JSON.stringify(customerDetails)
      );
      sessionStorage.setItem("orderTotal", total.toFixed(2));

      // Redirect to payment page
      router.push("/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (isLoggedIn) {
      if (!validateForm()) return;

      // Update profile with shipping details
      try {
        await fetch("/api/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerDetails.email,
            address: customerDetails.address,
            address2: customerDetails.address2,
            city: customerDetails.city,
            state: customerDetails.state,
            zipCode: customerDetails.zipCode,
            landmark: customerDetails.landmark,
          }),
        });

        sessionStorage.setItem(
          "checkoutDetails",
          JSON.stringify(customerDetails)
        );
        sessionStorage.setItem("orderTotal", total.toFixed(2));
        router.push("/payment");
      } catch {
        setError("Failed to update profile");
      }
    } else {
      handleSendOtp();
    }
  };

  if (loading) {
    return (
      <main className="grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="grow py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    disabled={isLoggedIn && !!customerDetails.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      disabled={isLoggedIn && !!customerDetails.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-700"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10-digit mobile number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House/Flat No., Building Name *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="e.g., Flat 101, Sunshine Apartments"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area, Street, Sector, Village (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={customerDetails.address2 || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="e.g., Sector 15, MG Road"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={customerDetails.landmark || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="e.g., Near City Hospital, Behind Metro Station"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={customerDetails.zipCode}
                      onChange={handleInputChange}
                      maxLength={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="110001"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      City and State will auto-fill
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City/District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={otpLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Lock size={20} />
                <span>
                  {otpLoading
                    ? "Processing..."
                    : isLoggedIn
                    ? "Proceed to Payment"
                    : "Verify & Continue"}
                </span>
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock size={16} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Phone Number
            </h3>
            <p className="text-gray-600 mb-6">
              Enter the 6-digit OTP sent to {customerDetails.phone}
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest text-gray-900 bg-white mb-4"
              placeholder="000000"
              maxLength={6}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length !== 6}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {otpLoading ? "Verifying..." : "Verify"}
              </button>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
