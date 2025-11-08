"use client";

import { ShoppingCart, Trash2, Share2 } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <main className="grow py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlist.length} items saved</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Share2 size={20} />
            <span>Share Wishlist</span>
          </button>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/product/${item._id}`}>
                  <div className="relative">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/product/${item._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/product/${item._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <ShoppingCart size={18} />
                      <span>View Product</span>
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Trash2 size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (hidden when items exist) */}
        {wishlist.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
