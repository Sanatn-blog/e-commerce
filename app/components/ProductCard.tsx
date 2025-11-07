"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  reviews,
}: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(String(id));

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(String(id));
    } else {
      addToWishlist({
        _id: String(id),
        name,
        price,
        image,
        category,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="text-gray-400 group-hover:scale-110 transition-transform">
              <svg
                className="w-24 h-24"
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
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold z-10">
              -{discount}%
            </div>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 left-2 p-2 rounded-full shadow-md transition z-10 ${
              inWishlist
                ? "bg-rose-50 hover:bg-rose-100"
                : "bg-white hover:bg-gray-100"
            }`}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-5 h-5 ${
                inWishlist ? "text-rose-600" : "text-gray-600"
              }`}
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
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-1">{category}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">({reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
