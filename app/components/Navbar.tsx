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
    <>
      {/* Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-700 hover:text-gray-900 p-1.5"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link
                href="/"
                className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap"
              >
                <span className="text-red-500">Fashion</span>Store
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-4 ml-4">
                <Link
                  href="/men"
                  className="text-sm text-gray-700 hover:text-red-600 transition"
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  className="text-sm text-gray-700 hover:text-red-600 transition"
                >
                  Women
                </Link>
                <Link
                  href="/kids"
                  className="text-sm text-gray-700 hover:text-red-600 transition"
                >
                  Kids
                </Link>
                <Link
                  href="/new-arrivals"
                  className="text-sm text-gray-700 hover:text-red-600 transition"
                >
                  New
                </Link>
                <Link
                  href="/sale"
                  className="text-sm text-red-600 hover:text-red-700 font-semibold transition"
                >
                  Sale
                </Link>
              </div>
            </div>

            {/* Center: Desktop Search */}
            <div className="hidden md:block flex-1 max-w-sm mx-4">
              <SearchBar />
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleMobileSearch}
                className="md:hidden text-gray-700 hover:text-gray-900 p-2"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 text-gray-700 hover:text-red-600 transition"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-red-600 transition"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block ml-2">
                <AuthButton />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          {isMobileSearchOpen && (
            <div className="md:hidden py-2 border-t">
              <SearchBar />
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-white relative z-50">
              <div className="py-2 space-y-0.5">
                <Link
                  href="/men"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                  onClick={closeMobileMenu}
                >
                  Men
                </Link>
                <Link
                  href="/women"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                  onClick={closeMobileMenu}
                >
                  Women
                </Link>
                <Link
                  href="/kids"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                  onClick={closeMobileMenu}
                >
                  Kids
                </Link>
                <Link
                  href="/new-arrivals"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                  onClick={closeMobileMenu}
                >
                  New Arrivals
                </Link>
                <Link
                  href="/sale"
                  className="block px-4 py-2.5 text-red-600 hover:bg-red-50 transition font-semibold"
                  onClick={closeMobileMenu}
                >
                  Sale 🔥
                </Link>
                <div className="sm:hidden border-t pt-2 mt-2">
                  <AuthButton onNavigate={closeMobileMenu} isMobile={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
