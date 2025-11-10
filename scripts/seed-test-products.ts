import dotenv from "dotenv";
import path from "path";
import connectDB from "../lib/mongodb";
import Product from "../models/Product";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seedTestProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected successfully!\n");

    // Sample women's products
    const womenProducts = [
      {
        name: "Floral Summer Dress",
        description:
          "Beautiful floral print dress perfect for summer occasions",
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        category: "womens-clothing",
        subcategory: "Dresses",
        stock: 50,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Pink", "White"],
        images: [
          {
            public_id: "sample_dress_1",
            url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
          },
        ],
      },
      {
        name: "Casual Cotton Top",
        description: "Comfortable cotton top for everyday wear",
        price: 599,
        originalPrice: 899,
        discount: 33,
        category: "womens-clothing",
        subcategory: "Tops",
        stock: 100,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Navy"],
        images: [
          {
            public_id: "sample_top_1",
            url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
          },
        ],
      },
      {
        name: "High-Waist Denim Jeans",
        description: "Stylish high-waist denim jeans with perfect fit",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        category: "womens-clothing",
        subcategory: "Denim",
        stock: 75,
        sizes: ["26", "28", "30", "32", "34"],
        colors: ["Blue", "Black"],
        images: [
          {
            public_id: "sample_jeans_1",
            url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
          },
        ],
      },
    ];

    // Sample men's products
    const menProducts = [
      {
        name: "Classic Polo Shirt",
        description: "Timeless polo shirt for casual and semi-formal occasions",
        price: 799,
        originalPrice: 1299,
        discount: 38,
        category: "mens-clothing",
        subcategory: "Shirts",
        stock: 80,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy", "White", "Black", "Red"],
        images: [
          {
            public_id: "sample_polo_1",
            url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
          },
        ],
      },
      {
        name: "Slim Fit Chinos",
        description: "Modern slim fit chinos for a sharp look",
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        category: "mens-clothing",
        subcategory: "Pants",
        stock: 60,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Khaki", "Navy", "Black", "Grey"],
        images: [
          {
            public_id: "sample_chinos_1",
            url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
          },
        ],
      },
    ];

    const allProducts = [...womenProducts, ...menProducts];

    console.log(`Creating ${allProducts.length} test products...`);

    for (const productData of allProducts) {
      const product = await Product.create(productData);
      console.log(`✓ Created: ${product.name} (${product.category})`);
    }

    console.log(
      `\n✅ Successfully created ${allProducts.length} test products!`
    );
    console.log(`   - ${womenProducts.length} women's products`);
    console.log(`   - ${menProducts.length} men's products`);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    process.exit(0);
  }
}

seedTestProducts();
