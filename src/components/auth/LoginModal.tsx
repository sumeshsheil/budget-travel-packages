"use client";

import { ArrowLeft, Loader2, X } from "lucide-react";
import { AnimatePresence, m as motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AuthView } from "./types";

// Dynamic imports for view components
const LoginForm = dynamic(() => import("./views/LoginForm"));
const RegisterForm = dynamic(() => import("./views/RegisterForm"));
const ForgotPasswordForm = dynamic(() => import("./views/ForgotPasswordForm"));
const OtpVerificationForm = dynamic(() => import("./views/OtpVerificationForm"));
const ResetPasswordForm = dynamic(() => import("./views/ResetPasswordForm"));
const SetPasswordForm = dynamic(() => import("./views/SetPasswordForm"));

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<AuthView>("LOGIN");
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for flow data
  const [resetEmail, setResetEmail] = useState<string>("");
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");

  // Countdown timer state
  const [countdown, setCountdown] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const token = searchParams.get("token");
      const action = searchParams.get("action");

      if (token && action === "set-password") {
        setView("SET_PASSWORD");
      } else {
        setView("LOGIN");
      }

      setError(null);
      setSuccessMessage(null);
      setResetEmail("");
      setVerifiedOtp("");
      setCountdown(0);
    }
  }, [isOpen, searchParams]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const handleForgotPasswordSuccess = (email: string, message: string) => {
    setResetEmail(email);
    setCountdown(60);
    setSuccessMessage(message);
    setView("OTP_VERIFICATION");
  };

  const handleOtpSuccess = (otp: string) => {
    setVerifiedOtp(otp);
    setView("RESET_PASSWORD");
  };

  const handleResetSuccess = (message: string) => {
    setSuccessMessage(message);
    setView("LOGIN");
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        setError("Failed to resend OTP. Please try again.");
      } else {
        setCountdown(60);
        setSuccessMessage(`OTP resent to ${resetEmail}`);
      }
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  const renderView = () => {
    switch (view) {
      case "LOGIN":
        return <LoginForm onClose={onClose} onViewChange={setView} setError={setError} />;
      case "REGISTER":
        return <RegisterForm onClose={onClose} setError={setError} />;
      case "FORGOT_PASSWORD":
        return <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} setError={setError} />;
      case "OTP_VERIFICATION":
        return (
          <OtpVerificationForm
            email={resetEmail}
            onSuccess={handleOtpSuccess}
            setError={setError}
            setSuccessMessage={setSuccessMessage}
            resendCountdown={countdown}
            onResend={resendOtp}
            isLoading={false}
          />
        );
      case "RESET_PASSWORD":
        return (
          <ResetPasswordForm
            email={resetEmail}
            otp={verifiedOtp}
            onSuccess={handleResetSuccess}
            setError={setError}
          />
        );
      case "SET_PASSWORD":
        return (
          <SetPasswordForm
            token={searchParams.get("token")}
            onClose={onClose}
            onViewChange={setView}
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />
          <div className="fixed inset-0 overflow-y-auto z-70">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {view !== "LOGIN" && (
                  <button
                    onClick={() => {
                      if (view === "RESET_PASSWORD") {
                        setView("LOGIN");
                      } else if (view === "OTP_VERIFICATION") {
                        setView("FORGOT_PASSWORD");
                      } else {
                        setView("LOGIN");
                      }
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                <div className="flex flex-col items-center justify-center pt-8 pb-4">
                  <div className="relative w-66 h-28 mb-2">
                    <Image
                      src="/images/logo/footer-logo.svg"
                      alt="Budget Travel Packages"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {view === "LOGIN" && "Welcome Back"}
                    {view === "REGISTER" && "Create Account"}
                    {view === "FORGOT_PASSWORD" && "Forgot Password"}
                    {view === "OTP_VERIFICATION" && "Verify Email"}
                    {view === "RESET_PASSWORD" && "Reset Password"}
                    {view === "SET_PASSWORD" && "Set Password"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 px-6 text-center">
                    {view === "LOGIN" && "Sign in to access your account"}
                    {view === "REGISTER" && "Sign up to start your journey"}
                    {view === "FORGOT_PASSWORD" && "Enter your email to receive an OTP"}
                    {view === "RESET_PASSWORD" && "Create a new password for your account"}
                    {view === "SET_PASSWORD" && "Secure your account with a new password"}
                  </p>
                </div>

                <div className="p-8 pt-2">
                  {error && (
                    <div className="mb-6 rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {successMessage}
                    </div>
                  )}

                  <Suspense
                    fallback={
                      <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      </div>
                    }
                  >
                    {renderView()}
                  </Suspense>

                  {view === "LOGIN" && (
                    <div className="mt-8 text-center text-sm">
                      <p className="text-gray-500">
                        Don't have an account?{" "}
                        <button
                          onClick={() => setView("REGISTER")}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  )}

                  {view === "REGISTER" && (
                    <div className="mt-8 text-center text-sm">
                      <p className="text-gray-500">
                        Already have an account?{" "}
                        <button
                          onClick={() => setView("LOGIN")}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
