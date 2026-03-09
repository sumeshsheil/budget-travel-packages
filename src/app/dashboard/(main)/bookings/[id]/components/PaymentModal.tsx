"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import UpcomingPaymentsIcon from "@/components/ui/icons/upcoming-payments-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertTriangle, CheckCircle2,
    Clock, Copy,
    CreditCard, Download, Loader2, Phone,
    ShieldCheck, XCircle
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { submitBookingPayment } from "../payment-actions";

const BOOKING_AMOUNTS: Record<string, number> = {
  domestic: 666,
  international: 999,
};

interface BookingPayment {
  amount: number;
  type: "booking" | "trip_cost";
  transactionId: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
}

interface PaymentModalProps {
  leadId: string;
  tripType: string;
  tripCost?: number;
  budget: number;
  bookingPayments?: BookingPayment[];
  paymentStatus: string;
  paymentAmount?: number;
}

export default function PaymentModal({
  leadId,
  tripType,
  tripCost,
  budget,
  bookingPayments = [],
  paymentStatus,
  paymentAmount,
}: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const router = useRouter();

  // Determine payment state
  const bookingAmount = BOOKING_AMOUNTS[tripType] || 666;
  
  const legacyHasPaidBooking =
    paymentStatus === "partial" ||
    paymentStatus === "paid" ||
    !!(paymentAmount && paymentAmount >= bookingAmount);

  const hasBookingPayment =
    bookingPayments.some((p) => p.type === "booking" && p.status !== "rejected") ||
    legacyHasPaidBooking;

  const hasVerifiedBookingPayment =
    bookingPayments.some((p) => p.type === "booking" && p.status === "verified") ||
    legacyHasPaidBooking;

  const hasTripCostPayment =
    bookingPayments.some((p) => p.type === "trip_cost" && p.status !== "rejected") ||
    paymentStatus === "paid";

  // What payment is next?
  let currentPaymentType: "booking" | "trip_cost" = "booking";
  let currentAmount = bookingAmount;
  let canPay = true;
  let paymentLabel = "Booking Amount";
  let isCurrentPaymentPending = false;

  if (!hasBookingPayment) {
    // First payment: booking amount
    currentPaymentType = "booking";
    currentAmount = bookingAmount;
    paymentLabel = "Booking Amount";
    
    // Check if there's a pending booking payment
    isCurrentPaymentPending = bookingPayments.some(
      (p) => p.type === "booking" && p.status === "pending"
    );
  } else if (tripCost && !hasTripCostPayment) {
    // Second payment: remaining trip cost
    currentPaymentType = "trip_cost";
    let verifiedBookingAmount = bookingPayments
      .filter((p) => p.type === "booking" && p.status === "verified")
      .reduce((sum, p) => sum + p.amount, 0);

    // Fallback to legacy amount if verified is 0 but we know they paid
    if (verifiedBookingAmount === 0 && legacyHasPaidBooking) {
      verifiedBookingAmount = paymentAmount || bookingAmount;
    }

    currentAmount = tripCost - verifiedBookingAmount;
    
    // Edge case: if trip cost equals booking amount
    if (currentAmount <= 0) {
      canPay = false;
    }
    
    paymentLabel = "Trip Cost (Remaining)";
    
    // Check if there's a pending trip cost payment
    isCurrentPaymentPending = bookingPayments.some(
      (p) => p.type === "trip_cost" && p.status === "pending"
    );
  } else if (hasBookingPayment && !tripCost) {
    // Booking paid but trip cost not set yet
    canPay = false;
  } else {
    // All payments done
    canPay = false;
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = "/images/payments/qr-code.jpeg";
    link.download = "BudgetTravel_PaymentQR.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitBookingPayment(
        leadId,
        transactionId,
        currentPaymentType
      );

      if (result.success) {
        toast.success("Payment submitted! We will verify it shortly.");
        setIsOpen(false);
        setTransactionId("");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <>
      {/* Security Warning */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          <p className="font-bold mb-1 underline decoration-amber-500/30 decoration-2 underline-offset-2">
            ⚠️ Important Warning:
          </p>
          <p className="font-medium">
            All bookings and payments must be completed securely on our official website payment section.
          </p>
          <p className="mt-1 opacity-90">
            If you choose to make payments outside our official website and experience fraud or financial loss, Budget Travel Packages will not be responsible for such transactions.⚠️
          </p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-3">
        {/* Booking Amount Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Booking Amount</span>
          <span className="text-sm font-semibold">
            ₹{bookingAmount.toLocaleString("en-IN")}
            <span className="text-xs text-muted-foreground ml-1">
              ({tripType})
            </span>
          </span>
        </div>

        {/* Trip Cost Row */}
        {tripCost ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trip Cost</span>
            <span className="text-sm font-semibold text-emerald-600">
              ₹{tripCost.toLocaleString("en-IN")}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trip Cost</span>
            <span className="text-xs text-muted-foreground italic">
              To be set by agent
            </span>
          </div>
        )}

        {/* Budget (info only) */}
        <div className="flex items-center justify-between border-t border-dashed border-slate-200 dark:border-slate-700 pt-2">
          <span className="text-xs text-muted-foreground">Your Budget</span>
          <span className="text-xs text-muted-foreground">
            ₹{budget.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Previous Payments */}
      {bookingPayments.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Payment History
          </p>
          {bookingPayments.map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">
                    {payment.type === "booking"
                      ? "Booking Payment"
                      : "Trip Cost Payment"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Txn: {payment.transactionId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ₹{payment.amount.toLocaleString("en-IN")}
                </p>
                <Badge
                  className={`text-[9px] h-4 border capitalize ${getStatusColor(payment.status)}`}
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pay Now Button / Status */}
      {canPay && paymentStatus !== "paid" ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {paymentLabel} — ₹{currentAmount.toLocaleString("en-IN")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] space-y-0 gap-0 p-0 overflow-hidden rounded-3xl border-none">
                        {/* Header */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white mb-2 h-5">
                    Manual Payment
                  </Badge>
                  <DialogTitle className="text-2xl font-black">
                    {paymentLabel}
                  </DialogTitle>
                  <DialogDescription className="text-emerald-100 text-xs font-medium mt-1">
                    Pay ₹{currentAmount.toLocaleString("en-IN")} to confirm your{" "}
                    {currentPaymentType === "booking" ? "booking" : "trip"}.
                  </DialogDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-widest">
                    Amount
                  </p>
                  <p className="text-3xl font-black">
                    ₹{currentAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: QR and Details */}
                <div className="space-y-6">
                  <div className="relative group mx-auto w-fit bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg">
                    <div className="h-[180px] w-[180px] relative rounded-xl overflow-hidden">
                      <Image
                        src="/images/payments/qr-code.jpeg"
                        alt="Payment QR Code"
                        fill
                        className="object-cover"
                      />
                    </div>
                                        <button
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md rounded-full text-[9px] h-6 font-black uppercase tracking-wider px-3 flex items-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={handleDownloadQR}
                    >
                      <Download className="mr-1 h-2.5 w-2.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-600">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              UPI ID
                            </p>
                            <p className="text-xs font-black text-slate-900 dark:text-white">
                              sumesh.shil@ibl
                            </p>
                          </div>
                        </div>
                                                <button
                          className="h-7 w-7 opacity-40 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          onClick={() =>
                            copyToClipboard("sumesh.shil@ibl", "UPI ID")
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Phone
                            </p>
                            <p className="text-xs font-black text-slate-900 dark:text-white">
                              +91 9242868839
                            </p>
                          </div>
                        </div>
                                                <button
                          className="h-7 w-7 opacity-40 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          onClick={() =>
                            copyToClipboard("+91 9242868839", "Phone number")
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Confirmation Form */}
                <div className="flex flex-col h-full justify-between pt-2">
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <Label
                        htmlFor="bookingTransactionId"
                        className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block"
                      >
                        Transaction ID / Ref Number
                      </Label>
                      <Input
                        id="bookingTransactionId"
                        placeholder="Enter transaction ID"
                        className="bg-white dark:bg-slate-900 h-11 rounded-xl dark:border-slate-800 border-slate-200 focus:border-emerald-500 font-medium"
                        value={transactionId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTransactionId(e.target.value)
                        }
                      />
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        Enter the ID from your UPI app after payment is
                        completed.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-xl">
                      <p className="text-xs font-black text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Accepted Payment Methods
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        {["Paytm", "gpay", "phonepe", "upi"].map((brand) => (
                          <div
                            key={brand}
                            className="relative h-10 w-16 opacity-70"
                          >
                            <Image
                              src={`/images/payments/${brand}.webp`}
                              alt={brand}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                                        <button
                      className={`w-full h-12 rounded-2xl font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSubmitting || !transactionId 
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                      }`}
                      onClick={handleSubmitPayment}
                      disabled={isSubmitting || !transactionId}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-5 w-5" />
                          Submit Payment
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-3 uppercase tracking-widest font-bold">
                      Verification in 2-4 business hours.
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <UpcomingPaymentsIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : hasBookingPayment && !tripCost && paymentStatus !== "paid" && !isCurrentPaymentPending ? (
        <div className="text-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Booking Amount Confirmed</p>
            <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 font-medium leading-relaxed">
              Trip cost will be available once your agent sets the final price.
            </p>
          </div>
        </div>
      ) : null}

      {paymentStatus === "paid" && (
        <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
          <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-semibold">All payments completed</p>
          </div>
        </div>
      )}

    </>
  );
}
