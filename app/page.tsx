import HomePageClient from "./components/HomePageClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Carousel from "@/models/Carousel";

type MongoDocument = {
  _id: { toString: () => string };
  [key: string]: unknown;
};

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // Convert MongoDB documents to plain objects and serialize dates
    return products.map((product) => {
      const doc = product as unknown as MongoDocument & {
        images?: Array<{ public_id: string; url: string }>;
        createdAt: Date;
        updatedAt: Date;
      };
      return {
        ...doc,
        _id: doc._id.toString(),
        images:
          doc.images?.map((img) => ({
            public_id: img.public_id,
            url: img.url,
          })) || [],
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    return categories.map((category) => {
      const doc = category as unknown as MongoDocument & {
        name: string;
        slug: string;
        description?: string;
        image?: string;
        order: number;
      };
      return {
        _id: doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        description: doc.description || "",
        image: doc.image || "",
        order: doc.order,
      };
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function getCarousels() {
  try {
    await connectDB();
    const carousels = await Carousel.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    console.log("Server: Fetched carousels from DB:", carousels.length);

    const mappedCarousels = carousels.map((carousel) => {
      const doc = carousel as unknown as MongoDocument & {
        title: string;
        subtitle?: string;
        image?: string;
        link: string;
        order: number;
        isActive: boolean;
      };
      const result = {
        _id: doc._id.toString(),
        title: doc.title,
        subtitle: doc.subtitle,
        image: doc.image || "",
        link: doc.link,
        order: doc.order,
        isActive: doc.isActive,
      };
      console.log("Server: Carousel item image URL:", result.image);
      return result;
    });

    return mappedCarousels;
  } catch (error) {
    console.error("Failed to fetch carousels:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const carousels = await getCarousels();

  return (
    <HomePageClient
      products={products}
      categories={categories}
      carousels={carousels}
    />
  );
}
