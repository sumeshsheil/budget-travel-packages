"use client";

import { AnimatePresence, m as motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("cookie-consent-accepted");
    
    // Hide if already accepted OR if we are on the legal page
    if (!consent && pathname !== "/legal") {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [pathname]);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-accepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent-accepted", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md z-10"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 overflow-hidden">
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    Privacy & Policy Agreement
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      By using our website, you agree to our use of cookies and our{" "}
                      <Link
                        href="/legal#privacy"
                        className="text-emerald-600 font-bold hover:underline underline-offset-4"
                      >
                        Privacy Policy
                      </Link>.
                    </p>
                    
                    {/* Simplified Payment Warning Note */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <p className="text-sm text-slate-800 font-bold leading-snug">
                        NB: Make sure to do all payments through the website for security and tracking.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAccept}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl transition-all active:scale-95"
                >
                  Accept & Agree
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
