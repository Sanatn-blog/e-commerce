import mongoose, { Schema, Document } from "mongoose";

export interface ICarousel extends Document {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarouselSchema = new Schema<ICarousel>(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Carousel ||
  mongoose.model<ICarousel>("Carousel", CarouselSchema);
