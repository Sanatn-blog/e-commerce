"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface CategoryFormProps {
  categoryId?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategory?: string;
  isActive: boolean;
  order: number;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentCategory: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(
          data.categories.filter((c: Category) => c._id !== categoryId)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`);
      const data = await response.json();
      if (data.success) {
        const category = data.category;
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          image: category.image || "",
          parentCategory: category.parentCategory?._id || "",
          isActive: category.isActive,
          order: category.order,
        });
        setImagePreview(category.image || "");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "name" && !categoryId) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const loadingToast = toast.loading("Uploading image...");
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
        toast.success("Image uploaded successfully!", { id: loadingToast });
      } else {
        toast.error("Failed to upload image", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading(
      categoryId ? "Updating category..." : "Creating category..."
    );

    try {
      const url = categoryId
        ? `/api/admin/categories/${categoryId}`
        : "/api/admin/categories";
      const method = categoryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          categoryId
            ? "Category updated successfully!"
            : "Category created successfully!",
          { id: loadingToast }
        );
        setTimeout(() => router.push("/admin/categories"), 1000);
      } else {
        toast.error(data.error || "Failed to save category", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Men's Shoes"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className=" block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="e.g., mens-shoes"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter a brief description of this category..."
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleChange}
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None (Top Level)</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="0"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                className="rounded object-cover"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Active Category
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : categoryId ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
