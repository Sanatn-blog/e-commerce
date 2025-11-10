import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { sendNewsletterEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter!" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();

        // Send welcome email
        await sendNewsletterEmail(email);

        return NextResponse.json({
          message: "Welcome back! Your subscription has been reactivated.",
          subscriber: existingSubscriber,
        });
      }
    }

    // Create new subscriber
    const newSubscriber = await Newsletter.create({
      email,
      subscribedAt: new Date(),
      isActive: true,
    });

    // Send welcome email
    await sendNewsletterEmail(email);

    return NextResponse.json({
      message: "Successfully subscribed to newsletter!",
      subscriber: newSubscriber,
    });
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
