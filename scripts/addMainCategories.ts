import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

const categories = [
  {
    name: "Men",
    slug: "men",
    description: "Men's fashion and accessories",
    order: 1,
  },
  {
    name: "Women",
    slug: "women",
    description: "Women's fashion and accessories",
    order: 2,
  },
  {
    name: "Kids",
    slug: "kids",
    description: "Kids' fashion and accessories",
    order: 3,
  },
  { name: "Shoes", slug: "shoes", description: "Footwear for all", order: 4 },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories",
    order: 5,
  },
  {
    name: "Sale",
    slug: "sale",
    description: "Special offers and discounts",
    order: 6,
  },
];

async function seedCategories() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");

    for (const categoryData of categories) {
      const existing = await Category.findOne({ slug: categoryData.slug });
      if (existing) {
        console.log(
          `Category "${categoryData.name}" already exists, skipping...`
        );
      } else {
        await Category.create(categoryData);
        console.log(`✓ Created category: ${categoryData.name}`);
      }
    }

    console.log("\n✓ All categories processed successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedCategories();
