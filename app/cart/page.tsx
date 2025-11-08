"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 40.0) : 0;
  const tax = subtotal * 0.18; // 18% GST in India
  const total = subtotal + shipping + tax;

  return (
    <main className="grow py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item._id}-${item.size || "nosize"}-${
                  item.color || "nocolor"
                }-${index}`}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex space-x-4">
                  <Link
                    href={`/product/${item._id}`}
                    className="relative w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400 text-xs">Image</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/product/${item._id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.category}
                        </p>
                        {(item.size || item.color) && (
                          <div className="flex gap-2 mt-1">
                            {item.size && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item._id, item.size, item.color)
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1,
                              item.size,
                              item.color
                            )
                          }
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity + 1,
                              item.size,
                              item.color
                            )
                          }
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Tag size={20} className="text-gray-600" />
                <h3 className="font-semibold text-gray-900">Promo Code</h3>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
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
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 mb-3 ${
                  cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed pointer-events-none"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>7 days return & exchange</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free shipping over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add items to your cart to continue shopping
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
