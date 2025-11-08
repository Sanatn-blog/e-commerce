"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminHeader from "../../../components/AdminHeader";
import { Upload, X, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    category: "",
    stock: "",
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as { public_id: string; url: string }[],
  });

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchCategories();
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Debug: Log when images change
  useEffect(() => {
    console.log("=== formData.images CHANGED ===");
    console.log("New images value:", formData.images);
    console.log("Images count:", formData.images?.length);
    console.log("=== END formData.images CHANGED ===");
  }, [formData.images]);

  // Auto-calculate discount when price or originalPrice changes
  useEffect(() => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);

    if (price > 0 && originalPrice > 0 && originalPrice > price) {
      const calculatedDiscount = (
        ((originalPrice - price) / originalPrice) *
        100
      ).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        discount: calculatedDiscount,
      }));
    } else if (!formData.originalPrice || formData.originalPrice === "") {
      // Clear discount if original price is removed
      setFormData((prev) => ({
        ...prev,
        discount: "",
      }));
    }
  }, [formData.price, formData.originalPrice]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        const product = data.product;
        console.log("=== FETCH PRODUCT DEBUG ===");
        console.log("Full product data:", JSON.stringify(product, null, 2));
        console.log("Product images raw:", product.images);
        console.log("Images is array?", Array.isArray(product.images));
        console.log("Images length:", product.images?.length);

        // Log each image individually
        if (product.images) {
          product.images.forEach((img: any, idx: number) => {
            console.log(`Image ${idx}:`, img);
            console.log(`  - Has url?`, !!img?.url);
            console.log(`  - Has public_id?`, !!img?.public_id);
            console.log(`  - URL value:`, img?.url);
            console.log(`  - public_id value:`, img?.public_id);
          });
        }

        // Ensure images is always an array with proper structure
        const images = Array.isArray(product.images)
          ? product.images
              .filter((img: any) => {
                const isValid =
                  img && typeof img === "object" && img.url && img.public_id;
                if (!isValid) {
                  console.log("Filtered out invalid image:", img);
                }
                return isValid;
              })
              .map((img: any) => ({
                public_id: String(img.public_id),
                url: String(img.url),
              }))
          : [];

        console.log("Processed images for state:", images);
        console.log("=== END FETCH PRODUCT DEBUG ===");

        const newFormData = {
          name: product.name || "",
          description: product.description || "",
          price: product.price ? product.price.toString() : "",
          originalPrice: product.originalPrice
            ? product.originalPrice.toString()
            : "",
          discount: product.discount ? product.discount.toString() : "",
          category: product.category || "",
          stock: product.stock ? product.stock.toString() : "0",
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          colors: Array.isArray(product.colors) ? product.colors : [],
          images: images,
        };

        console.log("Setting form data with images:", newFormData.images);
        setFormData(newFormData);
        setImagesLoaded(true);
      } else {
        console.error("Failed to fetch product:", data.error);
        alert("Failed to load product: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
    setSizeInput("");
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    });
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
    }
    setColorInput("");
  };

  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    });
  };

  const uploadNewImages = async () => {
    if (newImageFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      for (const file of newImageFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          uploadedImages.push(result.data);
        }
      }
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new images
      const uploadedImages = await uploadNewImages();

      // Combine existing and new images
      const allImages = [...formData.images, ...uploadedImages];

      // Update product
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        stock: parseInt(formData.stock),
        images: allImages,
      };

      console.log("=== FRONTEND DEBUG ===");
      console.log("formData.images:", formData.images);
      console.log("uploadedImages:", uploadedImages);
      console.log("allImages:", allImages);
      console.log("allImages count:", allImages.length);
      console.log("formData.colors:", formData.colors);
      console.log("formData.sizes:", formData.sizes);
      console.log("productData.images:", productData.images);
      console.log("productData.colors:", productData.colors);
      console.log("productData.sizes:", productData.sizes);
      console.log("Full productData:", JSON.stringify(productData, null, 2));
      console.log("=== END FRONTEND DEBUG ===");

      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      console.log("=== RESPONSE FROM SERVER ===");
      console.log("Response:", JSON.stringify(result, null, 2));
      if (result.product) {
        console.log("Returned product colors:", result.product.colors);
        console.log("Returned product sizes:", result.product.sizes);
      }
      console.log("=== END RESPONSE ===");

      if (result.success) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-2">Update product information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (After Discount) *
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%) - Auto Calculated
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.discount}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed"
                        placeholder="Auto calculated"
                      />
                      {formData.discount && (
                        <p className="text-xs text-green-600 mt-1">
                          Calculated from original price
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        disabled={loadingCategories}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {loadingCategories ? (
                          <option value="">Loading categories...</option>
                        ) : categories.length === 0 ? (
                          <option value="">No categories available</option>
                        ) : (
                          <>
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat.slug}>
                                {cat.parentCategory
                                  ? `${cat.parentCategory.name} > ${cat.name}`
                                  : cat.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Images
                </h2>
                <div className="space-y-4">
                  {/* Existing Images */}
                  {!imagesLoaded ? (
                    <div className="text-sm text-gray-500 italic flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading images...
                    </div>
                  ) : formData.images && formData.images.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Current Images ({formData.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => {
                          console.log(`Rendering image ${index}:`, image.url);
                          return (
                            <div
                              key={`existing-${image.public_id}-${index}`}
                              className="relative group"
                            >
                              <img
                                src={image.url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                onLoad={() => {
                                  console.log(
                                    `Image ${index} loaded successfully:`,
                                    image.url
                                  );
                                }}
                                onError={(e) => {
                                  console.error(
                                    `Image ${index} failed to load:`,
                                    image.url
                                  );
                                  e.currentTarget.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EError%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No existing images
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Add New Images
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload images
                        </span>
                      </label>
                    </div>

                    {newImagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {newImagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sizes
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {commonSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => addSize(size)}
                        className={`px-4 py-2 rounded-lg border ${
                          formData.sizes.includes(size)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSize(sizeInput);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Add custom size"
                    />
                    <button
                      type="button"
                      onClick={() => addSize(sizeInput)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>

                  {formData.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => removeSize(size)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Colors
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addColor();
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Add color"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>

                  {formData.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color) => (
                        <span
                          key={color}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving || uploadingImages ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadingImages ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
