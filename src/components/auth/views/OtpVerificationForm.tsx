"use client";

import { OtpInput } from "@/components/landing/sections/booking/components/OtpInput";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface OtpVerificationFormValues {
  otp: string;
}

interface OtpVerificationFormProps {
  email: string;
  onSuccess: (otp: string) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
  resendCountdown: number;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

export default function OtpVerificationForm({
  email,
  onSuccess,
  setError,
  setSuccessMessage,
  resendCountdown,
  onResend,
  isLoading: parentLoading,
}: OtpVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpVerificationFormValues>({
    defaultValues: { otp: "" },
  });

  const otpValue = form.watch("otp");

  useEffect(() => {
    if (otpValue?.length === 6 && !isLoading && !parentLoading) {
      onSubmit({ otp: otpValue });
    }
  }, [otpValue, isLoading, parentLoading]);

  async function onSubmit(values: OtpVerificationFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      onSuccess(values.otp);
      form.reset();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Enter OTP Code</FormLabel>
              <FormControl>
                <div className="flex justify-center pt-2">
                  <OtpInput
                    value={field.value}
                    onChange={field.onChange}
                    length={6}
                    disabled={isLoading || parentLoading}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive code?{" "}
            {resendCountdown > 0 ? (
              <span className="text-emerald-600 font-medium">Resend in {resendCountdown}s</span>
            ) : (
              <button
                type="button"
                onClick={onResend}
                disabled={isLoading || parentLoading}
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline cursor-pointer disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || parentLoading || otpValue?.length !== 6}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
        >
          {isLoading || parentLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </Form>
  );
}
