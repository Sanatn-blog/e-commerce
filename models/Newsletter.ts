import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

const NewsletterSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
