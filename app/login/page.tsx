"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
      setCountdown(60);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    setStep("phone");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            {step === "phone"
              ? "Enter your phone number to continue"
              : "Enter the OTP sent to your phone"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                maxLength={10}
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter 10-digit Indian mobile number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                maxLength={6}
                required
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                OTP sent to {phone}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend OTP in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
