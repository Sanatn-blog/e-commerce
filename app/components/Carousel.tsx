"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CarouselItem {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

interface CarouselProps {
  items: CarouselItem[];
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const activeItems = items.filter((item) => item.isActive);

  const handleImageLoad = (itemId: string) => {
    console.log(`✅ Image loaded successfully for item: ${itemId}`);
    setLoadedImages((prev) => new Set(prev).add(itemId));
  };

  // Debug logging
  useEffect(() => {
    console.log("=== CAROUSEL DEBUG ===");
    console.log("Total items received:", items.length);
    console.log("Carousel items:", items);
    console.log("Active items:", activeItems.length);
    console.log("Active items data:", activeItems);
    if (activeItems.length > 0) {
      console.log("First item image URL:", activeItems[0].image);
      console.log("Current index:", currentIndex);
    }
    console.log("=== END DEBUG ===");
  }, [items, activeItems, currentIndex]);

  const handleImageError = (itemId: string) => {
    console.error(`Failed to load image for carousel item: ${itemId}`);
    setImageErrors((prev) => new Set(prev).add(itemId));
  };

  useEffect(() => {
    if (!isAutoPlaying || activeItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeItems.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeItems.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden mt-16">
      {/* Carousel Items */}
      <div className="relative h-full">
        {activeItems.map((item, index) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.link ? (
              <Link href={item.link} className="block h-full">
                <div className="relative h-full">
                  {imageErrors.has(item._id) ? (
                    <div className="w-full h-full bg-linear-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                      <p className="text-white text-lg">Image failed to load</p>
                    </div>
                  ) : (
                    <>
                      {!loadedImages.has(item._id) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Loading image...</p>
                          </div>
                        </div>
                      )}
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        onLoad={() => handleImageLoad(item._id)}
                        onError={() => handleImageError(item._id)}
                        priority={index === 0}
                        sizes="100vw"
                        unoptimized
                      />
                    </>
                  )}
                </div>
              </Link>
            ) : (
              <div className="relative h-full">
                {imageErrors.has(item._id) ? (
                  <div className="w-full h-full bg-linear-to-r flex items-center justify-center">
                    <p className="text-white text-lg">Image failed to load</p>
                  </div>
                ) : (
                  <>
                    {!loadedImages.has(item._id) && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                          <p>Loading image...</p>
                        </div>
                      </div>
                    )}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                      onLoad={() => handleImageLoad(item._id)}
                      onError={() => handleImageError(item._id)}
                      priority={index === 0}
                      sizes="100vw"
                      unoptimized
                    />
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-3 rounded-full transition-all shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-3 rounded-full transition-all shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all shadow-lg ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white bg-opacity-70 hover:bg-opacity-100 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
