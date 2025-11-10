"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  subcategory?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  rating: number;
  reviews: number;
}

interface FilterOptions {
  categories: string[];
  subcategories: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  filterOptions: FilterOptions;
}

export default function ProductsPageClient({
  initialProducts,
  filterOptions,
}: ProductsPageClientProps) {
  const [products] = useState<Product[]>(initialProducts);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions.priceRange.min,
    filterOptions.priceRange.max,
  ]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);

  // UI states
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    price: true,
    size: true,
    color: true,
    availability: true,
  });

  // Toggle filter section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle filter changes
  const toggleFilter = (
    filterType: "category" | "subcategory" | "size" | "color",
    value: string
  ) => {
    const setters = {
      category: setSelectedCategories,
      subcategory: setSelectedSubcategories,
      size: setSelectedSizes,
      color: setSelectedColors,
    };

    const setter = setters[filterType];
    const currentState = {
      category: selectedCategories,
      subcategory: selectedSubcategories,
      size: selectedSizes,
      color: selectedColors,
    }[filterType];

    if (currentState.includes(value)) {
      setter(currentState.filter((item) => item !== value));
    } else {
      setter([...currentState, value]);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([filterOptions.priceRange.min, filterOptions.priceRange.max]);
    setInStock(false);
    setOnSale(false);
  };

  // Apply filters using useMemo
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(
        (p) => p.subcategory && selectedSubcategories.includes(p.subcategory)
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((size) => selectedSizes.includes(size))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((color) => selectedColors.includes(color))
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Stock filter
    if (inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sale filter
    if (onSale) {
      filtered = filtered.filter((p) => p.discount && p.discount > 0);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Already sorted by createdAt in initial fetch
        break;
      default:
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategories,
    selectedSubcategories,
    selectedSizes,
    selectedColors,
    priceRange,
    inStock,
    onSale,
    sortBy,
  ]);

  const activeFiltersCount =
    selectedCategories.length +
    selectedSubcategories.length +
    selectedSizes.length +
    selectedColors.length +
    (inStock ? 1 : 0) +
    (onSale ? 1 : 0);

  // Filter sidebar render function
  const renderFilterSidebar = (isMobile = false) => (
    <div className={`${isMobile ? "h-full overflow-y-auto" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Category Filter */}
      {filterOptions.categories.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">Category</h3>
            {expandedSections.category ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {filterOptions.categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleFilter("category", cat)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                    {cat
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subcategory Filter */}
      {filterOptions.subcategories.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection("subcategory")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">Subcategory</h3>
            {expandedSections.subcategory ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.subcategory && (
            <div className="space-y-2">
              {filterOptions.subcategories.map((sub) => (
                <label
                  key={sub}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => toggleFilter("subcategory", sub)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                    {sub}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <input
              type="range"
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Size Filter */}
      {filterOptions.sizes.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection("size")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">Size</h3>
            {expandedSections.size ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.size && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleFilter("size", size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Filter */}
      {filterOptions.colors.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={() => toggleSection("color")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">Color</h3>
            {expandedSections.color ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections.color && (
            <div className="space-y-2">
              {filterOptions.colors.map((color) => (
                <label
                  key={color}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleFilter("color", color)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Availability</h3>
          {expandedSections.availability ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                In Stock Only
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                On Sale
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="grow bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-4 bg-white rounded-lg shadow-sm p-6">
              {renderFilterSidebar()}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">No products found</p>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div
              className="p-6 overflow-y-auto"
              style={{ height: "calc(100vh - 140px)" }}
            >
              {renderFilterSidebar(true)}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
