"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import mongoose from "mongoose";

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
    revalidatePath(`/dashboard/bookings/${leadId}`);

    return { success: true };
  } catch (error) {
    console.error("Error submitting payment:", error);
    return { success: false, error: "Failed to submit payment. Please try again." };
  }
}
