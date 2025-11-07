"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Store
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

          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-gray-900"
            >
              Wishlist
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
