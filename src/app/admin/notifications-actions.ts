"use server";

import { auth } from "@/lib/auth";
import Notification from "@/lib/db/models/Notification";
import { connectDB } from "@/lib/db/mongoose";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await connectDB();

    const notifications = await Notification.find({
      userId: session.user.id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await connectDB();

    await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { isRead: true },
    );

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await connectDB();

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { isRead: true },
    );

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}
