import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Address from "@/models/Address";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await verifyCustomerToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const addresses = await Address.find({
      customerId: customer.customerId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await verifyCustomerToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = body;

    if (
      !label ||
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    if (isDefault) {
      await Address.updateMany(
        { customerId: customer.customerId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      customerId: customer.customerId,
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
