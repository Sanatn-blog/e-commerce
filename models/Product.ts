import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  images: {
    public_id: string;
    url: string;
  }[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
    subcategory: {
      type: String,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sizes: [String],
    colors: [String],
  },
  {
    timestamps: true,
  }
);

// Delete the cached model to ensure schema updates are applied
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
