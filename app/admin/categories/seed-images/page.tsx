"use client";

import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import toast, { Toaster } from "react-hot-toast";

export default function SeedImagesPage() {
  const [loading, setLoading] = useState(false);

  const categoryImages: Record<string, string> = {
    men: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400",
    women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    kids: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400",
    shoes: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
    accessories:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400",
    sale: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
  };

  const seedImages = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Adding images to categories...");

    try {
      // Fetch all categories
      const response = await fetch("/api/admin/categories");
      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to fetch categories", { id: loadingToast });
        return;
      }

      const categories = data.categories;
      let updated = 0;

      // Update each category with an image if it doesn't have one
      for (const category of categories) {
        const imageUrl = categoryImages[category.slug];

        if (imageUrl && !category.image) {
          const updateResponse = await fetch(
            `/api/admin/categories/${category._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...category,
                image: imageUrl,
              }),
            }
          );

          const updateData = await updateResponse.json();
          if (updateData.success) {
            updated++;
          }
        }
      }

      toast.success(`Successfully added images to ${updated} categories!`, {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error seeding images:", error);
      toast.error("Failed to seed images", { id: loadingToast });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Seed Category Images
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">
              This utility will add placeholder images to categories that
              don&apos;t have images yet.
            </p>
            <p className="text-gray-600 mb-6">
              The following categories will be updated:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700">
              {Object.keys(categoryImages).map((slug) => (
                <li key={slug} className="mb-2">
                  <strong>{slug}</strong>: {categoryImages[slug]}
                </li>
              ))}
            </ul>
            <button
              onClick={seedImages}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Images..." : "Add Images to Categories"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
