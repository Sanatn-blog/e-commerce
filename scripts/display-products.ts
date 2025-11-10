import dotenv from "dotenv";
import connectDB from "../lib/mongodb";
import Product from "../models/Product";

// Load environment variables
dotenv.config();

async function displayProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected successfully!\n");

    const products = await Product.find({}).sort({ createdAt: -1 });

    if (products.length === 0) {
      console.log("No products found in the database.");
      return;
    }

    console.log(`Found ${products.length} product(s):\n`);
    console.log("=".repeat(80));

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Description: ${product.description}`);
      if (product.sizes && product.sizes.length > 0) {
        console.log(`   Sizes: ${product.sizes.join(", ")}`);
      }
      if (product.colors && product.colors.length > 0) {
        console.log(`   Colors: ${product.colors.join(", ")}`);
      }
      console.log(`   Images: ${product.images.length} image(s)`);
      product.images.forEach((img, i) => {
        console.log(`     ${i + 1}. ${img.url}`);
      });
      console.log(`   Created: ${product.createdAt}`);
      console.log(`   Updated: ${product.updatedAt}`);
      console.log("-".repeat(80));
    });

    console.log(`\nTotal products: ${products.length}`);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    process.exit(0);
  }
}

displayProducts();
