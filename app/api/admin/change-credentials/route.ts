import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    if (!newEmail && !newPassword) {
      return NextResponse.json(
        { error: "Please provide new email or new password" },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findById(session.adminId);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update email if provided
    if (newEmail) {
      if (newEmail === admin.email) {
        return NextResponse.json(
          { error: "New email must be different from current email" },
          { status: 400 }
        );
      }
      const existingAdmin = await Admin.findOne({ email: newEmail });
      if (existingAdmin) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      admin.email = newEmail;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
      // Check if new password is same as current password
      const isSamePassword = await bcrypt.compare(newPassword, admin.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password must be different from current password" },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Credentials updated successfully",
    });
  } catch (error) {
    console.error("Change credentials error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
