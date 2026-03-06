import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { sendWelcomeEmail, sendSetPasswordEmail } from "@/lib/email";

const subscribeSchema = z.object({
  email: z.string().email(),
  captchaToken: z.string().min(1, "Captcha is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message || "Invalid input." },
        { status: 400 },
      );
    }

    const { email, captchaToken } = validation.data;

    // Verify Cloudflare Turnstile
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY}&response=${captchaToken}`,
      },
    );

    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 403 },
      );
    }

    const customerEmail = email.toLowerCase();

    // Rate limiting
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const { allowed } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await connectDB();

    // Check if user already exists
    let user = await User.findOne({ email: customerEmail });
    let setPasswordUrl: string | undefined;

    if (user) {
      return NextResponse.json(
        { error: "You have already subscribed to our newsletter." },
        { status: 400 },
      );
    }

    // Create new account logic
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const placeholderPassword = await bcryptjs.hash(
      crypto.randomBytes(16).toString("hex"),
      12,
    );

    user = await User.create({
      email: customerEmail,
      password: placeholderPassword,
      name: "Traveler", // Default name
      role: "customer",
      isActivated: false,
      isPhoneVerified: false,
      setPasswordToken: hashedToken,
      setPasswordExpires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    });

    setPasswordUrl = `${process.env.NEXTAUTH_URL}/?token=${rawToken}&action=set-password`;

    // Send Welcome and Set Password Emails
    await sendWelcomeEmail({
      name: "Traveler",
      to: customerEmail,
    });

    if (setPasswordUrl) {
      await sendSetPasswordEmail({
        name: "Traveler",
        email: customerEmail,
        setPasswordUrl,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Successfully subscribed! Please check your email to activate your account.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
