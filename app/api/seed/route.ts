import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST() {
  try {
    await connectDB();

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already has ${existingProducts} products. Delete them first if you want to reseed.`,
      });
    }

    // Get current date for new arrivals
    const now = new Date();
    const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

    // Sample women's products
    const womenProducts = [
      {
        name: "Floral Summer Dress",
        description:
          "Beautiful floral print dress perfect for summer occasions. Made with breathable fabric for all-day comfort.",
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
        description:
          "Comfortable cotton top for everyday wear. Perfect for casual outings and office wear.",
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
        description:
          "Stylish high-waist denim jeans with perfect fit. Durable and comfortable for all-day wear.",
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
      {
        name: "Elegant Evening Gown",
        description:
          "Stunning evening gown for special occasions. Features elegant design and premium fabric.",
        price: 2999,
        originalPrice: 4999,
        discount: 40,
        category: "womens-clothing",
        subcategory: "Dresses",
        stock: 30,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Red", "Navy"],
        images: [
          {
            public_id: "sample_gown_1",
            url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
          },
        ],
      },
      {
        name: "Silk Blouse",
        description:
          "Luxurious silk blouse for a sophisticated look. Perfect for formal and semi-formal occasions.",
        price: 1899,
        originalPrice: 2999,
        discount: 37,
        category: "womens-clothing",
        subcategory: "Tops",
        stock: 60,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Ivory", "Black", "Burgundy"],
        images: [
          {
            public_id: "sample_blouse_1",
            url: "https://images.unsplash.com/photo-1564257577-d18b7c3a5b63?w=500",
          },
        ],
        createdAt: recentDate, // New arrival
      },
      {
        name: "Leather Handbag",
        description:
          "Premium leather handbag with spacious compartments. Perfect for work and casual outings.",
        price: 2499,
        originalPrice: 3999,
        discount: 38,
        category: "womens-clothing",
        subcategory: "Accessories",
        stock: 40,
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan"],
        images: [
          {
            public_id: "sample_handbag_1",
            url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
          },
        ],
      },
      {
        name: "Knit Cardigan",
        description:
          "Cozy knit cardigan for layering. Soft and comfortable for all-day wear.",
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        category: "womens-clothing",
        subcategory: "Tops",
        stock: 70,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige", "Grey", "Navy"],
        images: [
          {
            public_id: "sample_cardigan_1",
            url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
          },
        ],
        createdAt: recentDate, // New arrival
      },
    ];

    // Sample men's products
    const menProducts = [
      {
        name: "Classic Polo Shirt",
        description:
          "Timeless polo shirt for casual and semi-formal occasions. Made with premium cotton blend.",
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
        description:
          "Modern slim fit chinos for a sharp look. Versatile and comfortable for any occasion.",
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
      {
        name: "Leather Jacket",
        description:
          "Premium leather jacket with classic design. Perfect for adding edge to any outfit.",
        price: 4999,
        originalPrice: 7999,
        discount: 38,
        category: "mens-clothing",
        subcategory: "Outerwear",
        stock: 25,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Brown"],
        images: [
          {
            public_id: "sample_jacket_1",
            url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
          },
        ],
      },
      {
        name: "Formal Dress Shirt",
        description:
          "Crisp formal dress shirt for business and formal events. Non-iron fabric for easy care.",
        price: 999,
        originalPrice: 1599,
        discount: 38,
        category: "mens-clothing",
        subcategory: "Shirts",
        stock: 90,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Light Blue", "Pink"],
        images: [
          {
            public_id: "sample_dress_shirt_1",
            url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
          },
        ],
      },
      {
        name: "Denim Jacket",
        description:
          "Classic denim jacket with modern fit. A wardrobe essential for casual style.",
        price: 1799,
        originalPrice: 2999,
        discount: 40,
        category: "mens-clothing",
        subcategory: "Outerwear",
        stock: 45,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Light Blue", "Dark Blue", "Black"],
        images: [
          {
            public_id: "sample_denim_jacket_1",
            url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
          },
        ],
        createdAt: recentDate, // New arrival
      },
      {
        name: "Running Sneakers",
        description:
          "High-performance running sneakers with superior cushioning and support.",
        price: 2499,
        originalPrice: 3999,
        discount: 38,
        category: "mens-clothing",
        subcategory: "Footwear",
        stock: 55,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black", "White", "Grey"],
        images: [
          {
            public_id: "sample_sneakers_1",
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
          },
        ],
      },
    ];

    // Sample kids' products
    const kidsProducts = [
      {
        name: "Kids Graphic T-Shirt",
        description:
          "Fun graphic t-shirt for kids. Soft cotton fabric for comfortable play.",
        price: 399,
        originalPrice: 599,
        discount: 33,
        category: "kids",
        subcategory: "Tops",
        stock: 100,
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Red", "Blue", "Yellow", "Green"],
        images: [
          {
            public_id: "sample_kids_tshirt_1",
            url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
          },
        ],
      },
      {
        name: "Kids Denim Shorts",
        description:
          "Comfortable denim shorts for active kids. Durable and easy to wash.",
        price: 599,
        originalPrice: 899,
        discount: 33,
        category: "kids",
        subcategory: "Bottoms",
        stock: 80,
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Blue", "Black"],
        images: [
          {
            public_id: "sample_kids_shorts_1",
            url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
          },
        ],
        createdAt: recentDate, // New arrival
      },
      {
        name: "Kids Hoodie",
        description:
          "Cozy hoodie for kids. Perfect for cool weather and outdoor activities.",
        price: 799,
        originalPrice: 1299,
        discount: 38,
        category: "kids",
        subcategory: "Outerwear",
        stock: 65,
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Grey", "Navy", "Pink", "Black"],
        images: [
          {
            public_id: "sample_kids_hoodie_1",
            url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
          },
        ],
      },
      {
        name: "Kids Sneakers",
        description:
          "Comfortable sneakers for active kids. Lightweight and durable design.",
        price: 999,
        originalPrice: 1599,
        discount: 38,
        category: "kids",
        subcategory: "Footwear",
        stock: 70,
        sizes: ["10", "11", "12", "13", "1", "2", "3"],
        colors: ["Pink", "Blue", "Black", "White"],
        images: [
          {
            public_id: "sample_kids_sneakers_1",
            url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500",
          },
        ],
        createdAt: recentDate, // New arrival
      },
      {
        name: "Kids Backpack",
        description:
          "Colorful backpack for school and outings. Multiple compartments for organization.",
        price: 699,
        originalPrice: 1099,
        discount: 36,
        category: "kids",
        subcategory: "Accessories",
        stock: 90,
        sizes: ["One Size"],
        colors: ["Blue", "Pink", "Green", "Purple"],
        images: [
          {
            public_id: "sample_kids_backpack_1",
            url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
          },
        ],
      },
    ];

    const allProducts = [...womenProducts, ...menProducts, ...kidsProducts];

    // Insert all products
    const createdProducts = await Product.insertMany(allProducts);

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdProducts.length} test products!`,
      summary: {
        total: createdProducts.length,
        womens: womenProducts.length,
        mens: menProducts.length,
        kids: kidsProducts.length,
        newArrivals: allProducts.filter((p) => "createdAt" in p).length,
        onSale: allProducts.filter((p) => "originalPrice" in p).length,
      },
      products: createdProducts.map((p) => ({
        id: String(p._id),
        name: p.name,
        category: p.category,
        price: p.price,
      })),
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Optional: Add a DELETE endpoint to clear products
export async function DELETE() {
  try {
    await connectDB();
    const result = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete products",
      },
      { status: 500 }
    );
  }
}
