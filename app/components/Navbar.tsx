"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import AuthButton from "./AuthButton";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              <span className="text-red-500">Fashion</span>Store
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/men" className="text-gray-700 hover:text-gray-900">
                Men
              </Link>
              <Link href="/women" className="text-gray-700 hover:text-gray-900">
                Women
              </Link>
              <Link href="/kids" className="text-gray-700 hover:text-gray-900">
                Kids
              </Link>
              <Link
                href="/new-arrivals"
                className="text-gray-700 hover:text-gray-900"
              >
                New Arrivals
              </Link>
              <Link href="/sale" className="text-gray-700 hover:text-gray-900">
                Sale
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/wishlist"
              className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative group"
            >
              <div className="relative">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative group"
            >
              <div className="relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Cart</span>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
