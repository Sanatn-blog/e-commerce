import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: string;
  customerId: string;
  customerName: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per customer per product
ReviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
