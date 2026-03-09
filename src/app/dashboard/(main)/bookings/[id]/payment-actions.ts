"use server";

import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { createBulkNotification } from "@/lib/notifications";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function submitBookingPayment(
  leadId: string,
  transactionId: string,
  type: "booking" | "trip_cost"
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid booking ID" };
    }

    if (!transactionId || transactionId.trim() === "") {
      return { success: false, error: "Transaction ID is required" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return { success: false, error: "Booking not found" };
    }

    // Check if a payment of this type is already pending or verified
    const existingPayment = lead.bookingPayments?.find(
      (p: any) => p.type === type && (p.status === "pending" || p.status === "verified")
    );

    if (existingPayment) {
      return {
        success: false,
        error: `A ${type} payment is already ${existingPayment.status}.`,
      };
    }

    // Add the payment to the array
    const paymentAmount = type === "booking" 
      ? (lead.tripType === "international" ? 999 : 666) 
      : lead.tripCost || 0;

    const newPayment = {
      amount: paymentAmount,
      type,
      transactionId: transactionId.trim(),
      status: "pending" as const,
      submittedAt: new Date(),
    };

    if (!lead.bookingPayments) {
      lead.bookingPayments = [];
    }
    lead.bookingPayments.push(newPayment);

    // Stage will only be advanced to 'booked' when admin verifies the payment.

    await lead.save();

    // ------------------------------------------------------------------------
    // SEND NOTIFICATIONS TO ADMINS AND AGENT
    // ------------------------------------------------------------------------
    try {
      // Find all admin users
      const admins = await User.find({ role: "admin" }, "_id").lean();
      const notificationUserIds = admins.map((a: any) => a._id.toString());

      // Include the assigned agent if one exists
      if (lead.agentId && !notificationUserIds.includes(lead.agentId.toString())) {
        notificationUserIds.push(lead.agentId.toString());
      }

      if (notificationUserIds.length > 0) {
        const paymentAmountFormatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(paymentAmount);

        const paymentLabel = type === "booking" ? "Booking Payment" : "Trip Cost Payment";

        await createBulkNotification(notificationUserIds, {
          title: "New Payment Submitted",
          message: `${paymentLabel} of ${paymentAmountFormatted} was submitted for ${lead.travelers?.[0]?.name || 'a customer'}'s trip to ${lead.destination}.`,
          type: "success",
          link: `/admin/leads/${leadId}`,
        });
      }
    } catch (notifErr) {
      console.error("Failed to create payment notifications:", notifErr);
    }

    revalidatePath(`/dashboard/bookings/${leadId}`);

    return { success: true };
  } catch (error) {
    console.error("Error submitting payment:", error);
    return { success: false, error: "Failed to submit payment. Please try again." };
  }
}
