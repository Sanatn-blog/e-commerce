"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to account page with orders section
    router.push("/account?section=orders");
  }, [router]);

  return (
    <main className="grow py-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to orders...</p>
      </div>
    </main>
  );
}
