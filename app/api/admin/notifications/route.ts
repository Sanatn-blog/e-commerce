import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const query = unreadOnly ? { unread: true } : {};

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: await Notification.countDocuments({ unread: true }),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { type, title, message, relatedId, relatedModel } = body;

    const notification = await Notification.create({
      type,
      title,
      message,
      relatedId,
      relatedModel,
      unread: true,
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
