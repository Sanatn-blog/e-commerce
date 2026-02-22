"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import toast from "react-hot-toast";
import { Trash2, Edit, Plus, Image as ImageIcon, Upload } from "lucide-react";
import CustomAlert from "../components/CustomAlert";
import { useCustomAlert } from "../hooks/useCustomAlert";

interface CarouselItem {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export default function CarouselManagement() {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { isOpen, config, showConfirm, closeAlert, handleConfirm } = useCustomAlert();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      console.log("Fetching carousels from API...");
      const response = await fetch("/api/admin/carousel");
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched carousels:", data);
        setCarousels(data);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Failed to fetch carousels:", errorData);
        toast.error(
          `Failed to load carousels: ${errorData.details || errorData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error fetching carousels:", error);
      toast.error(
        `Failed to load carousels: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: reader.result }),
          });

          if (response.ok) {
            const data = await response.json();
            setFormData({ ...formData, image: data.url });
            toast.success("Image uploaded successfully");
          } else {
            toast.error("Failed to upload image");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploading(false);
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/carousel/${editingId}`
        : "/api/admin/carousel";
      const method = editingId ? "PUT" : "POST";

      console.log(`${method} ${url}`, formData);
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingId
            ? "Carousel updated successfully"
            : "Carousel created successfully"
        );
        resetForm();
        fetchCarousels();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Failed to save carousel:", errorData);
        toast.error(
          `Failed to save carousel: ${errorData.details || errorData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      toast.error(
        `An error occurred: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      {
        title: "Delete Carousel Item",
        message: "Are you sure you want to delete this carousel item? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          console.log("Deleting carousel:", id);
          const response = await fetch(`/api/admin/carousel/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            toast.success("Carousel deleted successfully");
            fetchCarousels();
          } else {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Unknown error" }));
            console.error("Failed to delete carousel:", errorData);
            toast.error(
              `Failed to delete carousel: ${errorData.details || errorData.error || "Unknown error"
              }`
            );
          }
        } catch (error) {
          console.error("Error deleting carousel:", error);
          toast.error(
            `An error occurred: ${error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    );
  };

  const handleEdit = (carousel: CarouselItem) => {
    setFormData({
      title: carousel.title,
      subtitle: carousel.subtitle || "",
      image: carousel.image,
      link: carousel.link || "",
      order: carousel.order,
      isActive: carousel.isActive,
    });
    setEditingId(carousel._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      link: "",
      order: 0,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

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
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Carousel Management
                </h1>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  {showForm ? "Cancel" : "Add New Slide"}
                </button>
              </div>

              {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-gray-900 text-xl font-semibold mb-4">
                    {editingId ? "Edit Carousel Slide" : "Add New Carousel Slide"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image *
                      </label>
                      <div className="space-y-2">
                        <label
                          htmlFor="image-upload"
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 inline-flex items-center gap-2 cursor-pointer"
                        >
                          {uploading ? (
                            <>
                              <Upload size={20} className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <ImageIcon size={20} />
                              Upload Image
                            </>
                          )}
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <Image
                              src={formData.image}
                              alt="Preview"
                              width={200}
                              height={128}
                              className="h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="/products/category"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: parseInt(e.target.value),
                          })
                        }
                        className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!formData.image || uploading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                      >
                        {editingId ? "Update" : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">Loading...</div>
                ) : carousels.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No carousel slides found. Add your first slide!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Image
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Subtitle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Order
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {carousels.map((carousel) => (
                          <tr key={carousel._id}>
                            <td className="px-6 py-4">
                              {carousel.image ? (
                                <Image
                                  src={carousel.image}
                                  alt={carousel.title}
                                  width={96}
                                  height={64}
                                  className="h-16 w-24 object-cover rounded"
                                  unoptimized
                                />
                              ) : (
                                <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center">
                                  <ImageIcon
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {carousel.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {carousel.subtitle || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {carousel.order}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${carousel.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {carousel.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(carousel)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(carousel._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
