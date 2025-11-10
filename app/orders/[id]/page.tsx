"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { customer, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push("/login");
    }
  }, [customer, authLoading, router]);

  useEffect(() => {
    if (customer && params.id) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/customer/orders/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "Failed to load order details");
      }
    } catch {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-600" size={24} />;
      case "shipped":
        return <Truck className="text-blue-600" size={24} />;
      case "processing":
        return <Package className="text-yellow-600" size={24} />;
      case "cancelled":
        return <XCircle className="text-red-600" size={24} />;
      default:
        return <Clock className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || loading) {
    return (
      <main className="grow py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "This order does not exist or you don't have access to it."}
            </p>
            <Link
              href="/account?section=orders"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          main {
            padding: 0 !important;
            background: white !important;
          }

          .print-container {
            max-width: 100% !important;
            padding: 20px !important;
          }

          .print-section {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }

          .print-header {
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
          }

          .print-table th,
          .print-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }

          .print-table th {
            background-color: #f3f4f6;
            font-weight: 600;
          }

          .print-total {
            border-top: 3px solid #000;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 18px;
          }

          .print-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
          }

          img {
            max-width: 60px !important;
            height: auto !important;
          }

          h1 {
            font-size: 28px;
          }

          h2 {
            font-size: 18px;
            margin-bottom: 15px;
          }
        }

        .print-only {
          display: none;
        }
      `}</style>

      <main className="grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print-container">
          <Link
            href="/account?section=orders"
            className="no-print inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </Link>

          {/* Print Header - Only visible when printing */}
          <div className="print-only print-header">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order Invoice</h1>
                <p className="text-gray-600">Your Store Name</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 no-print">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(
                    order.status
                  )} font-medium capitalize flex items-center space-x-2`}
                >
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Screen View */}
              <div className="bg-white rounded-lg shadow-sm p-6 no-print">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                    >
                      <Link href={`/product/${item.productId}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg hover:opacity-75 transition"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          <p>Quantity: {item.quantity}</p>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)} total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print View */}
              <div className="print-only print-section">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Details</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover"
                          />
                        </td>
                        <td>
                          <div className="font-medium">{item.name}</div>
                          {item.size && (
                            <div className="text-sm">Size: {item.size}</div>
                          )}
                          {item.color && (
                            <div className="text-sm">Color: {item.color}</div>
                          )}
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6 print-section">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin size={20} className="mr-2 no-print" />
                  Shipping Address
                </h2>
                <div className="text-gray-700">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="mt-2">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">
                    <span className="font-medium">Phone:</span> +91{" "}
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 print-section">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard size={20} className="mr-2 no-print" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-medium capitalize text-gray-900">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Status:</span>
                    <span className="font-medium capitalize text-gray-900">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 no-print">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck size={20} className="mr-2" />
                    Tracking Information
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Tracking Number
                      </p>
                      <p className="font-mono font-semibold text-gray-900">
                        {order.trackingNumber}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Track Order
                    </button>
                  </div>
                </div>
              )}

              {/* Print Tracking Info */}
              {order.trackingNumber && (
                <div className="print-only print-section">
                  <h2 className="text-xl font-semibold mb-4">
                    Tracking Information
                  </h2>
                  <p>
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 print-section">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0
                        ? "FREE"
                        : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900 print-total">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t no-print">
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Print Order
                  </button>
                </div>

                {order.status === "delivered" && (
                  <div className="mt-4 no-print">
                    <Link
                      href={`/product/${order.items[0].productId}`}
                      className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Buy Again
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="print-only print-footer">
            <p>Thank you for your order!</p>
            <p>For any queries, please contact our customer support.</p>
            <p className="mt-2">
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
