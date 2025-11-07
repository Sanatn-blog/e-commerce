import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { generateOTP, sendOTP, isValidPhone } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create customer
    let customer = await Customer.findOne({ phone });

    if (customer) {
      customer.otp = otp;
      customer.otpExpiry = otpExpiry;
      await customer.save();
    } else {
      customer = await Customer.create({
        phone,
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    // Send OTP
    const sent = await sendOTP(phone, otp);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      expiresIn: 600, // seconds
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
