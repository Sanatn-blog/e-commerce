import ProductsPageClient from "../components/ProductsPageClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function getAllProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.images?.[0]?.url || "/placeholder.jpg",
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock,
      rating: 4.5,
      reviews: 0,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getFilterOptions() {
  try {
    await connectDB();
    const products = await Product.find({}).lean();

    // Extract unique values for filters
    const categories = [...new Set(products.map((p) => p.category))];
    const subcategories = [
      ...new Set(
        products
          .map((p) => p.subcategory)
          .filter((s): s is string => Boolean(s))
      ),
    ];
    const sizes = [...new Set(products.flatMap((p) => p.sizes || []))];
    const colors = [...new Set(products.flatMap((p) => p.colors || []))];

    // Get price range
    const prices = products.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      categories,
      subcategories,
      sizes,
      colors,
      priceRange: { min: minPrice, max: maxPrice },
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      categories: [],
      subcategories: [],
      sizes: [],
      colors: [],
      priceRange: { min: 0, max: 10000 },
    };
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  const filterOptions = await getFilterOptions();

  return (
    <>
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
            Explore our complete collection. Find exactly what you&apos;re
            looking for with our advanced filters.
          </p>
        </div>
      </div>

      <ProductsPageClient
        initialProducts={products}
        filterOptions={filterOptions}
      />
    </>
  );
}
