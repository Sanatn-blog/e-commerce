"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import Hero from "./Hero";
import Carousel from "./Carousel";
import CategoryGrid from "./CategoryGrid";
import FeaturedProducts from "./FeaturedProducts";
import PromoSection from "./PromoSection";
import Features from "./Features";
import Newsletter from "./Newsletter";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface CarouselItem {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

interface HomePageClientProps {
  products: any[];
  categories: Category[];
  carousels: CarouselItem[];
}

export default function HomePageClient({
  products,
  categories,
  carousels,
}: HomePageClientProps) {
  const { customer, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show modal after loading is complete and user is not logged in
    if (!loading && !customer) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, customer]);

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      {carousels.length > 0 ? <Carousel items={carousels} /> : <Hero />}
      <main className="grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGrid categories={categories} />
          <FeaturedProducts products={products} />
          <PromoSection />
          <Features />
          <Newsletter />
        </div>
      </main>
    </>
  );
}
