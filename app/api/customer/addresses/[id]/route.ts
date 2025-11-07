import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Address from "@/models/Address";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const address = await Address.findOne({
      _id: id,
      customerId: customer.customerId,
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (body.isDefault) {
      await Address.updateMany(
        { customerId: customer.customerId },
        { isDefault: false }
      );
    }

    Object.assign(address, body);
    await address.save();

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await connectDB();

    const address = await Address.findOneAndDelete({
      _id: id,
      customerId: customer.customerId,
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
