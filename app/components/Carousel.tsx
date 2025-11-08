"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

  const activeItems = items.filter((item) => item.isActive);

  // Debug logging
  useEffect(() => {
    console.log("Carousel items:", items);
    console.log("Active items:", activeItems);
    if (activeItems.length > 0) {
      console.log("First item image:", activeItems[0].image);
    }
  }, [items, activeItems]);

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

  const currentItem = activeItems[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
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
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        {item.title}
                      </h2>
                      {item.subtitle && (
                        <p className="text-xl md:text-2xl lg:text-3xl">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-xl md:text-2xl lg:text-3xl">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-900 p-2 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-900 p-2 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
