import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { createCustomerToken, setCustomerSession } from "@/lib/customerAuth";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name, phone } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check OTP expiry
    if (!customer.otpExpiry || customer.otpExpiry < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Verify OTP
    if (customer.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Update customer
    customer.isVerified = true;
    customer.lastLogin = new Date();
    customer.otp = undefined;
    customer.otpExpiry = undefined;

    // Update name if provided
    if (name && !customer.name) {
      customer.name = name;
    }

    // Update phone if provided
    if (phone && !customer.phone) {
      customer.phone = phone;
    }

    await customer.save();

    // Create session (even if name is not set yet)
    const token = await createCustomerToken({
      customerId: customer._id.toString(),
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
    });

    await setCustomerSession(token);

    return NextResponse.json({
      message: "Login successful",
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
