"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { CreditCard, Lock, CheckCircle, ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutDetails {
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

export default function PaymentPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutDetails, setCheckoutDetails] =
    useState<CheckoutDetails | null>(null);
  const [orderTotal, setOrderTotal] = useState("0.00");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay"
  );
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const details = sessionStorage.getItem("checkoutDetails");
    const total = sessionStorage.getItem("orderTotal");

    if (!details || !total || cart.length === 0) {
      router.push("/cart");
      return;
    }

    setCheckoutDetails(JSON.parse(details));
    setOrderTotal(total);
    setLoading(false);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [cart, router]);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway is loading. Please wait...");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(orderTotal),
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency } = await orderResponse.json();

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: orderId,
        prefill: {
          name: checkoutDetails?.name || "",
          email: checkoutDetails?.email || "",
          contact: checkoutDetails?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Create order in database
            const orderData = {
              items: cart,
              customerDetails: checkoutDetails,
              paymentMethod: "razorpay",
              paymentDetails: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              },
              total: parseFloat(orderTotal),
              status: "paid",
            };

            // Save order to database
            const saveOrderResponse = await fetch("/api/customer/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });

            if (!saveOrderResponse.ok) {
              throw new Error("Failed to save order");
            }

            const { order } = await saveOrderResponse.json();
            console.log("Order saved successfully:", order);

            // Clear cart and session storage
            clearCart();
            sessionStorage.removeItem("checkoutDetails");
            sessionStorage.removeItem("orderTotal");

            setOrderPlaced(true);

            // Redirect to orders page after 2 seconds
            setTimeout(() => {
              router.push("/account?section=orders");
            }, 2000);
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      // Cash on Delivery
      setProcessing(true);
      setError("");

      try {
        // Create order
        const orderData = {
          items: cart,
          customerDetails: checkoutDetails,
          paymentMethod: "cod",
          paymentDetails: null,
          total: parseFloat(orderTotal),
          status: "pending",
        };

        // Save order to database
        const saveOrderResponse = await fetch("/api/customer/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!saveOrderResponse.ok) {
          throw new Error("Failed to save order");
        }

        const { order } = await saveOrderResponse.json();
        console.log("Order saved successfully:", order);

        // Clear cart and session storage
        clearCart();
        sessionStorage.removeItem("checkoutDetails");
        sessionStorage.removeItem("orderTotal");

        setOrderPlaced(true);

        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          router.push("/account?section=orders");
        }, 2000);
      } catch (err: any) {
        setError("Order placement failed. Please try again.");
        setProcessing(false);
      }
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

  if (orderPlaced) {
    return (
      <main className="grow flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You will receive a confirmation email
              shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-3xl font-bold text-gray-900">${orderTotal}</p>
            </div>
            <Link
              href="/account?section=orders"
              className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              View Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grow py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/checkout"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Checkout
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "razorpay" | "cod")
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard size={24} className="ml-3 text-gray-600" />
                  <span className="ml-3 text-gray-900 font-medium">
                    Pay Online (Razorpay)
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    Cards, UPI, Wallets
                  </span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "razorpay" | "cod")
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <Wallet size={24} className="ml-3 text-gray-600" />
                  <span className="ml-3 text-gray-900 font-medium">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            {/* Razorpay Info */}
            {paymentMethod === "razorpay" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-2">
                  <strong>Secure Online Payment:</strong> You will be redirected
                  to Razorpay's secure payment gateway.
                </p>
                <p className="text-sm text-blue-700">
                  Accepted payment methods: Credit/Debit Cards, UPI, Net
                  Banking, Wallets
                </p>
              </div>
            )}

            {/* COD Info */}
            {paymentMethod === "cod" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Cash on Delivery:</strong> Pay when you receive your
                  order. Please keep exact change ready.
                </p>
              </div>
            )}

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

              {checkoutDetails && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Shipping To:
                  </h3>
                  <p className="text-sm text-gray-600">
                    {checkoutDetails.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {checkoutDetails.address}
                  </p>
                  {checkoutDetails.address2 && (
                    <p className="text-sm text-gray-600">
                      {checkoutDetails.address2}
                    </p>
                  )}
                  {checkoutDetails.landmark && (
                    <p className="text-sm text-gray-500 italic">
                      Near: {checkoutDetails.landmark}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {checkoutDetails.city}, {checkoutDetails.state} -{" "}
                    {checkoutDetails.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">India</p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Phone:</strong> +91 {checkoutDetails.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {checkoutDetails.email}
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${orderTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Lock size={20} />
                <span>{processing ? "Processing..." : "Place Order"}</span>
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock size={16} />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
