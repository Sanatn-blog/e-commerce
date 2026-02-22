import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const customer = await Customer.findById(session.customerId).select(
      "-otp -otpExpiry"
    );

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        image: customer.image,
        isVerified: customer.isVerified,
      },
    });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
