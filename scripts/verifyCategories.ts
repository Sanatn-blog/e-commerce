import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    image: String,
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isActive: Boolean,
    order: Number,
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function verifyCategories() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB\n");

    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });

    console.log(`Found ${categories.length} active categories:\n`);
    categories.forEach((cat) => {
      console.log(`✓ ${cat.name} (/${cat.slug}) - Order: ${cat.order}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

verifyCategories();
