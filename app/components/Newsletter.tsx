"use client";

import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        const message =
          data.message || "Successfully subscribed to newsletter!";
        toast.success(message);
        setSuccessMessage(message);
        setEmail("");
      } else {
        const error = data.error || "Failed to subscribe. Please try again.";
        toast.error(error);
        setErrorMessage(error);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMsg = "Something went wrong. Please try again.";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="bg-linear-to-r from-rose-500 to-pink-600 rounded-2xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-rose-50 mb-8 max-w-2xl mx-auto">
          Get the latest updates on new products and upcoming sales. Plus, get
          10% off your first order!
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-100 placeholder:text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {errorMessage && (
            <p className="mt-3 text-red-100 bg-red-500/30 px-4 py-2 rounded-lg text-sm">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mt-3 text-green-100 bg-green-500/30 px-4 py-2 rounded-lg text-sm">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
