import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  phone: string;
  name?: string;
  email?: string;
  image?: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const CustomerSchema: Schema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

export default mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
