import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ customer: null });
    }

    await connectDB();

    const customer = await Customer.findById(session.customerId).select(
      "-otp -otpExpiry"
    );

    if (!customer) {
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({
      customer: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ customer: null });
  }
}
