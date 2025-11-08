import Link from "next/link";
import Image from "next/image";
import { JSX, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface CategoryGridProps {
  categories: Category[];
}

const categoryIcons: Record<string, { icon: JSX.Element; color: string }> = {
  men: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    color: "bg-blue-100 text-blue-600",
  },
  women: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    color: "bg-pink-100 text-pink-600",
  },
  kids: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "bg-yellow-100 text-yellow-600",
  },
  shoes: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    color: "bg-green-100 text-green-600",
  },
  accessories: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    color: "bg-purple-100 text-purple-600",
  },
  sale: {
    icon: (
      <svg
        className="w-12 h-12 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    color: "bg-red-100 text-red-600",
  },
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (categoryId: string) => {
    setImageErrors((prev) => new Set(prev).add(categoryId));
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const categoryStyle = categoryIcons[category.slug] || {
            icon: (
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ),
            color: "bg-gray-100 text-gray-600",
          };

          const hasValidImage =
            category.image && !imageErrors.has(category._id);

          return (
            <Link
              key={category._id}
              href={`/${category.slug}`}
              className={`${
                hasValidImage ? "bg-white text-gray-900" : categoryStyle.color
              } rounded-xl p-6 text-center hover:shadow-lg transition-all hover:scale-105 overflow-hidden`}
            >
              {hasValidImage ? (
                <div className="mb-3 relative w-full h-24 mx-auto">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover rounded-lg"
                    unoptimized
                    onError={() => handleImageError(category._id)}
                  />
                </div>
              ) : (
                <div className="mb-3">{categoryStyle.icon}</div>
              )}
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
