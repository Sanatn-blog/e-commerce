import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, address, address2, city, state, zipCode, landmark } =
      await request.json();

    await connectDB();

    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Update customer profile
    if (email) customer.email = email;
    if (address) customer.address = address;
    if (address2 !== undefined) customer.address2 = address2;
    if (city) customer.city = city;
    if (state) customer.state = state;
    if (zipCode) customer.zipCode = zipCode;
    if (landmark !== undefined) customer.landmark = landmark;

    await customer.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      customer: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
