"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [authModalImage, setAuthModalImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch settings");
      }
      const data = await res.json();
      const authImageSetting = data.settings.find(
        (s: { key: string }) => s.key === "authModalImage"
      );
      if (authImageSetting) {
        setAuthModalImage(authImageSetting.value);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Upload response:", data);

      // Handle different response structures
      const imageUrl = data.data?.url || data.url || data.data?.secure_url;
      if (imageUrl) {
        setAuthModalImage(imageUrl);
        setMessage("Image uploaded successfully");
      } else {
        throw new Error("No URL in response");
      }
    } catch (error) {
      setMessage("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "authModalImage",
          value: authModalImage,
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setMessage("Settings saved successfully");
    } catch (error) {
      setMessage("Failed to save settings");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings Management
              </h1>
              <p className="text-gray-600">
                Manage your application settings and configurations
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Auth Modal Image
              </h2>
              <p className="text-gray-600 mb-6">
                Upload an image to display on the left side of the
                login/register modal
              </p>

              <div className="space-y-6">
                {authModalImage && (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img
                      src={authModalImage}
                      alt="Auth Modal Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {uploading && (
                    <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={authModalImage}
                    onChange={(e) => setAuthModalImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !authModalImage}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
