import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST() {
  try {
    await connectDB();

    await Notification.updateMany({ unread: true }, { unread: false });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
