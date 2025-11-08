import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  phone: string;
  name?: string;
  email?: string;
  image?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  landmark?: string;
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
  address: {
    type: String,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
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
