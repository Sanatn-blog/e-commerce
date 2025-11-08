import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";

async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return null;
    }

    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

async function getRelatedProducts(category: string, currentId: string) {
  try {
    await connectDB();
    const products = await Product.find({
      category,
      _id: { $ne: currentId },
    })
      .limit(4)
      .lean();

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, id);

  return (
    <main className="grow">
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </main>
  );
}
