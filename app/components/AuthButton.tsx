"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function AuthButton() {
  const { customer, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (customer) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User size={18} />
          <span className="text-sm font-medium">
            {customer.name || customer.phone}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
      >
        Register
      </Link>
    </div>
  );
}
