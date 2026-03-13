"use client";

// OTP length from MessageCentral Verify Now API (default is 4).
const OTP_LENGTH = 4;

// Supported country codes (India Only)
const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;

import Button from "@/components/landing/ui/button";
import {
  resetForm, setCurrentStep, setPhoneVerified, setSpecialRequests,
  updatePrimaryContact
} from "@/lib/redux/features/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useBookingValidation } from "../hooks/useBookingValidation";
import { labelClass } from "../styles";
import type { Traveler } from "../types";
import { ContactDetailsFields } from "./ContactDetailsFields";
import { FormTextarea } from "./FormTextarea";
import { PhoneVerificationField } from "./PhoneVerificationField";
import { TripSummary } from "./TripSummary";

export const Step2Form: React.FC = () => {
  const dispatch = useAppDispatch();
  const step1 = useAppSelector((state) => state.booking.step1);
  const { specialRequests, primaryContact, phoneVerified } = useAppSelector(
    (state) => state.booking.step2,
  );
  const { data: session } = useSession();
  const contactErrors = useAppSelector(
    (state) => state.booking.validation.contactErrors,
  );
  const { validateStep2 } = useBookingValidation();

  // Local state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // Refs
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Load draft from local storage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("booking_step2_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Restore special requests
        if (parsed.specialRequests) {
          dispatch(setSpecialRequests(parsed.specialRequests));
        }
        // Restore contact details
        if (parsed.primaryContact) {
          Object.entries(parsed.primaryContact).forEach(([key, value]) => {
            dispatch(
              updatePrimaryContact({
                field: key as keyof Traveler,
                value: value as string | number,
              }),
            );
          });
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [dispatch]);

  // Save to local storage on change
  useEffect(() => {
    const draft = { specialRequests, primaryContact };
    localStorage.setItem("booking_step2_draft", JSON.stringify(draft));
  }, [specialRequests, primaryContact]);

  // Auto-verify if user is logged in and already phone-verified in DB
  useEffect(() => {
    if (session?.user?.isPhoneVerified && !phoneVerified) {
      dispatch(setPhoneVerified(true));
      // If we just verified via session, ensure the phone number is also synced
      if (session.user.phone && primaryContact.phone !== session.user.phone) {
        dispatch(updatePrimaryContact({ field: "phone", value: session.user.phone }));
      }
    }
  }, [session, phoneVerified, dispatch, primaryContact.phone]);

  // Pre-fill user details from session if available
  useEffect(() => {
    if (session?.user) {
      const u = session.user;
      
      if (!primaryContact.firstName && u.firstName)
        dispatch(updatePrimaryContact({ field: "firstName", value: u.firstName }));
      if (!primaryContact.lastName && u.lastName)
        dispatch(updatePrimaryContact({ field: "lastName", value: u.lastName }));
      if (!primaryContact.email && u.email)
        dispatch(updatePrimaryContact({ field: "email", value: u.email }));
      if (!primaryContact.gender && u.gender)
        dispatch(updatePrimaryContact({ field: "gender", value: u.gender }));
      if (!primaryContact.age && u.age)
        dispatch(updatePrimaryContact({ field: "age", value: u.age }));
      if (!primaryContact.phone && u.phone)
        dispatch(updatePrimaryContact({ field: "phone", value: u.phone }));
        
      // Also pre-fill name if firstName/lastName are missing but 'name' exists in session
      if (!primaryContact.firstName && !primaryContact.lastName && u.name) {
        const [first, ...rest] = u.name.split(" ");
        dispatch(updatePrimaryContact({ field: "firstName", value: first }));
        if (rest.length > 0) {
          dispatch(updatePrimaryContact({ field: "lastName", value: rest.join(" ") }));
        }
      }
    }
  }, [session, dispatch]); // Removed primaryContact dependencies to avoid re-triggering unnecessarily

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (field: keyof Traveler, value: string | number) => {
    dispatch(updatePrimaryContact({ field, value }));
  };

  const handleSendOtp = async () => {
    // Validate all fields in step 2 before sending OTP
    const isValid = await validateStep2({
      specialRequests,
      primaryContact,
    });
    if (!isValid) {
      return;
    }

    // Explicitly validate phone number for India regex (extra safety)
    if (!INDIA_PHONE_REGEX.test(primaryContact.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: primaryContact.phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setVerificationId(data.verificationId);
      setOtpSent(true);
      setCooldown(60);
      toast.success(`OTP sent to +91 ${primaryContact.phone}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send OTP.";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const currentOtp = typeof otpValue === "string" ? otpValue : otp;

    if (currentOtp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          otp: currentOtp,
          phone: primaryContact.phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      dispatch(setPhoneVerified(true));
      setOtpSent(false); // Hide OTP box
      setOtpError("");
      setOtp(""); // Clear OTP input
      toast.success("Phone verified successfully!");

      // Auto-focus submit button
      setTimeout(() => submitBtnRef.current?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP.";
      setOtpError(message);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    dispatch(setPhoneVerified(false));
    setOtp("");
    setOtpError("");
    setVerificationId("");
    setCooldown(0);
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateStep2({
      specialRequests,
      primaryContact,
    });
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...step1,
        guests: Number(step1.guests),
        budget: Number(step1.budget),
        specialRequests,
        primaryContact,
      };

      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to submit booking");

      toast.success("Booking submitted successfully! Redirecting...");
      localStorage.removeItem("booking_step2_draft"); // Clear draft
      dispatch(resetForm());
      // Explicitly clear query params or just push to thank you
      router.push("/thank-you");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Dynamic Summary */}
      <TripSummary step1={step1} />

      {/* Special Requests */}
      <FormTextarea
        label="Special Requests"
        value={specialRequests}
        onChange={(e) => dispatch(setSpecialRequests(e.target.value))}
        placeholder="Any special requests or preferences..."
        rows={3}
        maxLength={500}
        showCharCount
        currentLength={specialRequests.length}
      />

      {/* Primary Contact Details */}
      <ContactDetailsFields
        primaryContact={primaryContact}
        contactErrors={contactErrors}
        onChange={handleChange}
      />

      {/* Phone Verification */}
      <div className="border border-primary rounded-lg p-4 md:p-6 bg-white shadow-sm">
        <label className={labelClass}>Phone Verification *</label>
        <div className="mt-4">
          <PhoneVerificationField
            phone={primaryContact.phone}
            phoneVerified={phoneVerified}
            otpSent={otpSent}
            isVerifying={isVerifying}
            isShaking={isShaking}
            cooldown={cooldown}
            otp={otp}
            otpError={otpError}
            contactError={contactErrors.phone}
            onPhoneChange={(val) => handleChange("phone", val)}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            onChangeNumber={handleChangeNumber}
            setOtp={setOtp}
            setOtpError={setOtpError}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex-1 border border-primary text-black font-bold py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg disabled:opacity-50 cursor-pointer"
        >
          Back
        </button>
        <Button
          ref={submitBtnRef}
          type="submit"
          disabled={isSubmitting || !phoneVerified}
          className="flex-1 bg-primary text-black font-bold py-4 rounded-lg hover:shadow-lg transition-shadow text-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking"
          )}
        </Button>
      </div>
    </form>
  );
};
