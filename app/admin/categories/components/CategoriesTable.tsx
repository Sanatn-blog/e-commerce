"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategory?: { _id: string; name: string };
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface CategoryWithChildren extends Category {
  hasChildren?: boolean;
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        const categoriesData: Category[] = data.categories;
        // Mark categories that have children
        const categoriesWithChildren = categoriesData.map((cat) => ({
          ...cat,
          hasChildren: categoriesData.some(
            (c) => c.parentCategory?._id === cat._id
          ),
        }));
        setCategories(categoriesWithChildren);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"?\n\nNote: Categories with subcategories cannot be deleted.`
      )
    )
      return;

    const loadingToast = toast.loading("Deleting category...");
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Category deleted successfully!", { id: loadingToast });
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to delete category", {
          id: loadingToast,
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category", { id: loadingToast });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(
          `Category ${
            !currentStatus ? "activated" : "deactivated"
          } successfully!`,
          { id: loadingToast }
        );
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to update category", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category", { id: loadingToast });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    {category.hasChildren && (
                      <span
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                        title="This category has subcategories"
                      >
                        Has subcategories
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{category.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {category.parentCategory?.name || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      toggleActive(category._id, category.isActive)
                    }
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/categories/edit/${category._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}
