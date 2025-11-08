import { Schema, models, model, connect, connection } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
      type: Schema.Types.ObjectId,
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
  models.Category || model("Category", CategorySchema);

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and accessories",
    image: "",
    isActive: true,
    order: 1,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and fashion accessories",
    image: "",
    isActive: true,
    order: 2,
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home and kitchen essentials",
    image: "",
    isActive: true,
    order: 3,
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    image: "",
    isActive: true,
    order: 4,
  },
  {
    name: "Books",
    slug: "books",
    description: "Books and reading materials",
    image: "",
    isActive: true,
    order: 5,
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Beauty products and personal care items",
    image: "",
    isActive: true,
    order: 6,
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    description: "Toys and games for all ages",
    image: "",
    isActive: true,
    order: 7,
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "Car accessories and parts",
    image: "",
    isActive: true,
    order: 8,
  },
];

async function seedCategories() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce";

    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Category.deleteMany({});
    console.log("Cleared existing categories");

    const createdParents = await Category.insertMany(categories);
    console.log(`Created ${createdParents.length} parent categories`);

    const parentMap = {};
    createdParents.forEach((cat) => {
      parentMap[cat.name] = cat._id.toString();
    });

    const childCategories = [
      {
        name: "Smartphones",
        slug: "smartphones",
        description: "Mobile phones and accessories",
        image: "",
        parentCategory: parentMap["Electronics"],
        isActive: true,
        order: 1,
      },
      {
        name: "Laptops",
        slug: "laptops",
        description: "Laptops and notebooks",
        image: "",
        parentCategory: parentMap["Electronics"],
        isActive: true,
        order: 2,
      },
      {
        name: "Headphones",
        slug: "headphones",
        description: "Headphones and earbuds",
        image: "",
        parentCategory: parentMap["Electronics"],
        isActive: true,
        order: 3,
      },
      {
        name: "Cameras",
        slug: "cameras",
        description: "Digital cameras and accessories",
        image: "",
        parentCategory: parentMap["Electronics"],
        isActive: true,
        order: 4,
      },
      {
        name: "Men's Clothing",
        slug: "mens-clothing",
        description: "Clothing for men",
        image: "",
        parentCategory: parentMap["Fashion"],
        isActive: true,
        order: 1,
      },
      {
        name: "Women's Clothing",
        slug: "womens-clothing",
        description: "Clothing for women",
        image: "",
        parentCategory: parentMap["Fashion"],
        isActive: true,
        order: 2,
      },
      {
        name: "Shoes",
        slug: "shoes",
        description: "Footwear for all",
        image: "",
        parentCategory: parentMap["Fashion"],
        isActive: true,
        order: 3,
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories",
        image: "",
        parentCategory: parentMap["Fashion"],
        isActive: true,
        order: 4,
      },
      {
        name: "Furniture",
        slug: "furniture",
        description: "Home furniture",
        image: "",
        parentCategory: parentMap["Home & Kitchen"],
        isActive: true,
        order: 1,
      },
      {
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        description: "Kitchen tools and appliances",
        image: "",
        parentCategory: parentMap["Home & Kitchen"],
        isActive: true,
        order: 2,
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Decorative items for home",
        image: "",
        parentCategory: parentMap["Home & Kitchen"],
        isActive: true,
        order: 3,
      },
      {
        name: "Fitness Equipment",
        slug: "fitness-equipment",
        description: "Gym and fitness equipment",
        image: "",
        parentCategory: parentMap["Sports & Outdoors"],
        isActive: true,
        order: 1,
      },
      {
        name: "Camping & Hiking",
        slug: "camping-hiking",
        description: "Outdoor camping and hiking gear",
        image: "",
        parentCategory: parentMap["Sports & Outdoors"],
        isActive: true,
        order: 2,
      },
      {
        name: "Fiction",
        slug: "fiction",
        description: "Fiction books",
        image: "",
        parentCategory: parentMap["Books"],
        isActive: true,
        order: 1,
      },
      {
        name: "Non-Fiction",
        slug: "non-fiction",
        description: "Non-fiction books",
        image: "",
        parentCategory: parentMap["Books"],
        isActive: true,
        order: 2,
      },
      {
        name: "Skincare",
        slug: "skincare",
        description: "Skincare products",
        image: "",
        parentCategory: parentMap["Beauty & Personal Care"],
        isActive: true,
        order: 1,
      },
      {
        name: "Makeup",
        slug: "makeup",
        description: "Makeup and cosmetics",
        image: "",
        parentCategory: parentMap["Beauty & Personal Care"],
        isActive: true,
        order: 2,
      },
      {
        name: "Action Figures",
        slug: "action-figures",
        description: "Action figures and collectibles",
        image: "",
        parentCategory: parentMap["Toys & Games"],
        isActive: true,
        order: 1,
      },
      {
        name: "Board Games",
        slug: "board-games",
        description: "Board games for family fun",
        image: "",
        parentCategory: parentMap["Toys & Games"],
        isActive: true,
        order: 2,
      },
    ];

    const createdChildren = await Category.insertMany(childCategories);
    console.log(`Created ${createdChildren.length} child categories`);

    console.log("\n✅ Successfully seeded categories!");
    console.log(
      `Total categories: ${createdParents.length + createdChildren.length}`
    );

    await connection.close();
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
