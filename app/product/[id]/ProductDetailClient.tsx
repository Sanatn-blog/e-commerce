"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { useWishlist } from "@/app/context/WishlistContext";

interface ProductImage {
  public_id: string;
  url: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  stock: number;
  sizes?: string[];
  colors?: string[];
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Add to cart:", {
      product: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        category: product.category,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-rose-600">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${product.category}`}
          className="hover:text-rose-600 capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                loading="eager"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg
                  className="w-32 h-32 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.public_id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-rose-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "fill-current" : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-lg font-bold text-black mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition ${
                      selectedSize === size
                        ? "border-rose-600 bg-rose-50 text-rose-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-900 bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-lg font-bold text-black mb-3">
                Select Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition capitalize ${
                      selectedColor === color
                        ? "border-rose-600 bg-rose-50 text-rose-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-900 bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-lg font-bold text-black mb-3">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition bg-white text-gray-900 font-bold text-xl"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition bg-white text-gray-900 font-bold text-xl disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-rose-600 text-white py-4 rounded-lg hover:bg-rose-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`w-14 h-14 border-2 rounded-lg transition flex items-center justify-center ${
                inWishlist
                  ? "border-rose-600 bg-rose-50 text-rose-600"
                  : "border-gray-300 bg-white text-gray-900 hover:border-rose-600 hover:text-rose-600"
              }`}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg
                className="w-6 h-6"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
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
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 font-medium transition ${
                activeTab === "description"
                  ? "border-b-2 border-rose-600 text-rose-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 font-medium transition ${
                activeTab === "reviews"
                  ? "border-b-2 border-rose-600 text-rose-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Reviews (128)
            </button>
          </div>
        </div>

        {activeTab === "description" ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">Reviews coming soon...</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                id={relatedProduct._id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                image={
                  relatedProduct.images?.[0]?.url || "/placeholder-image.jpg"
                }
                category={relatedProduct.category}
                rating={4}
                reviews={45}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
