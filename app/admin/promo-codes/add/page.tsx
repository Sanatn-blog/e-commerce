"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import toast, { Toaster } from "react-hot-toast";

export default function AddPromoCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minPurchaseAmount: "0",
    maxDiscountAmount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: parseFloat(formData.minPurchaseAmount),
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      };

      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Promo code created successfully");
        router.push("/admin/promo-codes");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create promo code");
      }
    } catch (error) {
      toast.error("Failed to create promo code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Add Promo Code
            </h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="SUMMER2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Summer sale discount"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value,
                      })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      formData.discountType === "percentage" ? "10" : "100"
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.discountType === "percentage"
                      ? "Enter percentage (e.g., 10 for 10%)"
                      : "Enter amount in rupees"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Discount Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value,
                      })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional cap on discount amount
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Purchase Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.minPurchaseAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPurchaseAmount: e.target.value,
                      })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for unlimited usage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Promo Code"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-900 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
