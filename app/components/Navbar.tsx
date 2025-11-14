"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import AuthButton from "./AuthButton";
import SearchBar from "./SearchBar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap"
          >
            <span className="text-red-500">Fashion</span>Store
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
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

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={toggleMobileSearch}
              className="md:hidden text-gray-700 hover:text-gray-900 p-2"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative"
            >
              <div className="relative">
                <Heart size={20} className="sm:w-6 sm:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-xs mt-1">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative"
            >
              <div className="relative">
                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-xs mt-1">Cart</span>
            </Link>

            {/* Auth Button */}
            <div className="hidden sm:block">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 space-y-1 bg-gradient-to-b from-white to-gray-50">
            <Link
              href="/men"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all duration-200 font-medium border-l-4 border-transparent hover:border-red-500"
              onClick={closeMobileMenu}
            >
              Men
            </Link>
            <Link
              href="/women"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all duration-200 font-medium border-l-4 border-transparent hover:border-red-500"
              onClick={closeMobileMenu}
            >
              Women
            </Link>
            <Link
              href="/kids"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all duration-200 font-medium border-l-4 border-transparent hover:border-red-500"
              onClick={closeMobileMenu}
            >
              Kids
            </Link>
            <Link
              href="/new-arrivals"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all duration-200 font-medium border-l-4 border-transparent hover:border-red-500"
              onClick={closeMobileMenu}
            >
              New Arrivals
            </Link>
            <Link
              href="/sale"
              className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:pl-6 transition-all duration-200 font-medium border-l-4 border-transparent hover:border-red-500"
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-2">
                Sale
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Hot
                </span>
              </span>
            </Link>
            <div className="sm:hidden px-4 py-3 border-t border-gray-200 mt-2 pt-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
