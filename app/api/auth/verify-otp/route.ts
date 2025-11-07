import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { createCustomerToken, setCustomerSession } from "@/lib/customerAuth";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findOne({ phone });

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

    if (name && !customer.name) {
      customer.name = name;
    }

    await customer.save();

    // Create session
    const token = await createCustomerToken({
      customerId: customer._id.toString(),
      phone: customer.phone,
      name: customer.name,
    });

    await setCustomerSession(token);

    return NextResponse.json({
      message: "Login successful",
      customer: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
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
