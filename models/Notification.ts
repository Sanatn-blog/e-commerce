import mongoose from "mongoose";

export interface INotification extends mongoose.Document {
  type: "order" | "stock" | "delivery" | "product" | "user" | "payment";
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: string;
  unread: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["order", "stock", "delivery", "product", "user", "payment"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: String,
    },
    relatedModel: {
      type: String,
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
