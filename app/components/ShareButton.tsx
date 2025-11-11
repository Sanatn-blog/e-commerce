"use client";

import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";

interface ShareButtonProps {
  productName: string;
  productUrl: string;
}

export default function ShareButton({
  productName,
  productUrl,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { success, error } = useToast();

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Check if Web Share API is available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Check out ${productName}`,
          url: productUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(productUrl);
        success("Link copied to clipboard!");
      }
    } catch (err) {
      // User cancelled share or error occurred
      if (err instanceof Error && err.name !== "AbortError") {
        error("Failed to share");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="w-14 h-14 border-2 border-gray-300 bg-white text-gray-900 rounded-lg transition flex items-center justify-center hover:border-rose-600 hover:text-rose-600 disabled:opacity-50"
      title="Share product"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
    </button>
  );
}
