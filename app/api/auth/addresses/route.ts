import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      addresses: customer.savedAddresses || [],
      success: true,
    });
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
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    await dbConnect();
    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // If this is set as default, unset all other defaults
    if (body.isDefault) {
      customer.savedAddresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    customer.savedAddresses.push(body);
    await customer.save();

    return NextResponse.json({
      success: true,
      addresses: customer.savedAddresses,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { addressId, ...updates } = await req.json();

    await dbConnect();
    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const addressIndex = customer.savedAddresses.findIndex(
      (addr: any) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset all other defaults
    if (updates.isDefault) {
      customer.savedAddresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    Object.assign(customer.savedAddresses[addressIndex], updates);
    await customer.save();

    return NextResponse.json({
      success: true,
      addresses: customer.savedAddresses,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    customer.savedAddresses = customer.savedAddresses.filter(
      (addr: any) => addr._id.toString() !== addressId
    );

    await customer.save();

    return NextResponse.json({
      success: true,
      addresses: customer.savedAddresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
