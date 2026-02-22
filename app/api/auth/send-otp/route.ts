import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { generateOTP, sendOTPEmail, isValidEmail } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { email, phone, name } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create customer
    let customer = await Customer.findOne({ email });

    if (customer) {
      customer.otp = otp;
      customer.otpExpiry = otpExpiry;
      // Update phone and name if provided
      if (phone) customer.phone = phone;
      if (name) customer.name = name;
      await customer.save();
    } else {
      customer = await Customer.create({
        email,
        phone: phone || "",
        name: name || "",
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    // Send OTP
    const sent = await sendOTPEmail(email, otp);

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
