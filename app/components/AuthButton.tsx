"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, ChevronDown, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AuthButton({
  onNavigate,
  isMobile = false,
}: {
  onNavigate?: () => void;
  isMobile?: boolean;
}) {
  const { customer, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (customer) {
    const profileImage = (customer as { image?: string }).image || null;

    // Mobile version - show as dropdown
    if (isMobile) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={customer.name || "Profile"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {customer.name || "User"}
              </p>
              <p className="text-xs text-gray-600">{customer.phone}</p>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform shrink-0 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNavigate?.();
                }}
              >
                <User size={18} />
                <span className="text-sm">Profile</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNavigate?.();
                }}
              >
                <Package size={18} />
                <span className="text-sm">Orders</span>
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNavigate?.();
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition font-medium border-t border-gray-100"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    // Desktop version - show as dropdown
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={customer.name || "Profile"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-600" />
            )}
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {customer.name || "User"}
              </p>
              <p className="text-xs text-gray-500">{customer.phone}</p>
            </div>
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigate?.();
              }}
            >
              <User size={18} />
              <span className="text-sm font-medium">View Profile</span>
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigate?.();
              }}
            >
              <Package size={18} />
              <span className="text-sm font-medium">My Orders</span>
            </Link>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
        onClick={onNavigate}
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        onClick={onNavigate}
      >
        Register
      </Link>
    </div>
  );
}
