"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thanks for subscribing!");
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
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
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
            className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
