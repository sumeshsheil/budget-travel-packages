"use client";

import React from "react";
import Image from "next/image";
import { OtpInput } from "./OtpInput";
import { getInputClass } from "../styles";

interface PhoneVerificationFieldProps {
  phone: string;
  phoneVerified: boolean;
  otpSent: boolean;
  isVerifying: boolean;
  isShaking: boolean;
  cooldown: number;
  otp: string;
  otpError: string;
  contactError?: string;
  onPhoneChange: (phone: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: (otp: string) => void;
  onChangeNumber: () => void;
  setOtp: (otp: string) => void;
  setOtpError: (error: string) => void;
}

const OTP_LENGTH = 4;

export const PhoneVerificationField: React.FC<PhoneVerificationFieldProps> = ({
  phone,
  phoneVerified,
  otpSent,
  isVerifying,
  isShaking,
  cooldown,
  otp,
  otpError,
  contactError,
  onPhoneChange,
  onSendOtp,
  onVerifyOtp,
  onChangeNumber,
  setOtp,
  setOtpError,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 font-medium text-gray-500 flex items-center gap-1.5 select-none pointer-events-none border-r border-gray-300 pr-2 h-5">
          <Image
            src="/images/flag/india.jpg"
            alt="India"
            width={20}
            height={14}
            className="rounded-sm object-cover"
          />
          <span className="text-sm">+91</span>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Phone Number"
          maxLength={10}
          disabled={otpSent || phoneVerified}
          className={`${getInputClass(!!contactError)} pl-22 pr-24 h-12 transition-all ${
            otpSent || phoneVerified
              ? "bg-gray-50 text-gray-500 font-medium"
              : "bg-white"
          }`}
        />

        <div className="absolute right-1 top-1 bottom-1 flex items-center">
          {otpSent || phoneVerified ? (
            <button
              type="button"
              onClick={onChangeNumber}
              disabled={phoneVerified && isVerifying}
              className="h-full px-4 text-xs font-bold text-primary hover:bg-primary/5 rounded-md transition-all border border-transparent hover:border-primary/10 cursor-pointer"
            >
              Change
            </button>
          ) : (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={isVerifying}
              className="h-full px-5 rounded-md bg-primary text-black font-bold text-xs hover:shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isVerifying ? "Sending..." : "Verify"}
            </button>
          )}
        </div>
      </div>
      {contactError && (
        <p className="text-red-500 text-xs pl-1" role="alert">
          {contactError}
        </p>
      )}

      {/* OTP Section or Success Status */}
      {phoneVerified ? (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-10 h-10 min-w-[40px] rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl shadow-sm">
            ✓
          </div>
          <div>
            <p className="text-black font-bold text-base">Verified Successfully</p>
            <p className="text-black/60 text-xs">Your contact number is confirmed.</p>
          </div>
        </div>
      ) : (
        otpSent && (
          <div className={`pt-2 ${isShaking ? "animate-shake" : ""}`}>
            <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600" role="status">
                  Enter OTP sent to <span className="font-bold text-black">+91 {phone}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    setOtpError("");
                    if (val.length === OTP_LENGTH) onVerifyOtp(val);
                  }}
                  length={OTP_LENGTH}
                  error={otpError}
                  disabled={isVerifying}
                />
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex-1" />
                <div className="flex-1 text-right">
                  {cooldown > 0 ? (
                    <span className="text-xs text-gray-400 font-medium tabular-nums" role="timer">
                      Resend in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onSendOtp}
                      disabled={isVerifying}
                      className="text-xs text-primary font-bold hover:underline disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
