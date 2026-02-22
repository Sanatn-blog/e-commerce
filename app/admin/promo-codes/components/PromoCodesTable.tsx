"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import CustomAlert from "../../components/CustomAlert";
import { useCustomAlert } from "../../hooks/useCustomAlert";

interface PromoCode {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PromoCodesTable() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, config, showConfirm, closeAlert, handleConfirm } = useCustomAlert();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch("/api/admin/promo-codes");
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      toast.error("Failed to fetch promo codes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      {
        title: "Delete Promo Code",
        message: "Are you sure you want to delete this promo code? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          const response = await fetch(`/api/admin/promo-codes/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Promo code deleted successfully");
            fetchPromoCodes();
          } else {
            toast.error("Failed to delete promo code");
          }
        } catch (error) {
          toast.error("Failed to delete promo code");
        }
      }
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <CustomAlert
        isOpen={isOpen}
        onClose={closeAlert}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        type={config.type}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
      />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((promo) => (
                <tr key={promo._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => copyCode(promo.code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {promo.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {promo.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : `₹${promo.discountValue}`}
                    </div>
                    {promo.maxDiscountAmount && (
                      <div className="text-xs text-gray-500">
                        Max: ₹{promo.maxDiscountAmount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{promo.minPurchaseAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promo.usedCount}
                    {promo.usageLimit && ` / ${promo.usageLimit}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(promo.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                      to {new Date(promo.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isExpired(promo.endDate) ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    ) : isUpcoming(promo.startDate) ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Upcoming
                      </span>
                    ) : promo.isActive ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/promo-codes/edit/${promo._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {promoCodes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No promo codes found. Create your first promo code!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
