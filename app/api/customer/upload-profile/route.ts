import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    await connectDB();

    // Find the customer first to get the old image
    const customer = await Customer.findById(session.customerId);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Delete old image from Cloudinary if it exists
    if (customer.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = customer.image.split("/");
        const publicIdWithExt = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExt.split(".")[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Continue even if deletion fails
      }
    }

    // Upload new image to Cloudinary
    console.log("Uploading image to Cloudinary...");
    const uploadResult = await uploadImage(image, "customer-profiles");
    console.log("Upload successful:", uploadResult.url);

    // Update customer with new image URL
    customer.image = uploadResult.url;
    await customer.save();
    console.log("Customer updated with new image");

    return NextResponse.json({
      message: "Profile image updated successfully",
      customer: {
        id: customer._id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        image: customer.image,
      },
    });
  } catch (error) {
    console.error("Upload profile error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to upload profile image", details: errorMessage },
      { status: 500 }
    );
  }
}
