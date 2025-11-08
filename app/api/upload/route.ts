import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let base64File: string;

    // Handle JSON request with base64 string
    if (contentType.includes("application/json")) {
      const body = await request.json();
      if (!body.file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }
      base64File = body.file;
    }
    // Handle FormData request
    else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Convert file to base64 for Cloudinary upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64File = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      return NextResponse.json(
        { error: "Invalid content type. Expected JSON or FormData" },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "carousel",
      resource_type: "auto",
    });

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
