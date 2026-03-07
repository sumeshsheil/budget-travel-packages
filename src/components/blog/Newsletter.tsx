"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = React.useRef<TurnstileInstance>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    if (!captchaToken) {
      setShowCaptcha(true);
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      toast.success(data.message || "Subscribed successfully!");
      setEmail("");
      setCaptchaToken(null);
      setShowCaptcha(false);
    } catch (error: any) {
      setStatus("error");
      setCaptchaToken(null);
      setShowCaptcha(false);
      setErrorMessage(
        error.message || "Failed to subscribe. Please try again.",
      );
      toast.error(error.message || "Failed to subscribe. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-box px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto  bg-[url('/images/blog/newsletter-bg.png')] bg-cover bg-center bg-no-repeat rounded-xl p-8 md:p-16 text-center relative overflow-hidden shadow-xl"
        >
          {/* Overlay to make text readable */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-secondary mb-4 tracking-tight">
              Get Travel Deals
            </h2>
            <p className="text-gray-800 text-base md:text-lg mb-10 max-w-md mx-auto font-medium">
              Join our newsletter for the best budget guides and exclusive
              itineraries.
            </p>

            <div className="max-w-xl mx-auto">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 border border-white/20 p-8 rounded-3xl"
                >
                  <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">
                    Check Your Inbox!
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    We&apos;ve sent an activation link to your email.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-xs font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    Add another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative group space-y-4">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white p-2 rounded-2xl md:rounded-full shadow-lg gap-2">
                    <div className="flex-1 flex items-center px-4">
                      <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-4 text-gray-900 outline-none font-open-sans text-base placeholder:text-gray-400 bg-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      id="newsletter-submit-btn"
                      disabled={status === "loading" || showCaptcha}
                      className="bg-new-blue text-white px-10 py-4 rounded-xl md:rounded-full font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Subscribe
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {showCaptcha && (
                    <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ""}
                        onSuccess={(token) => {
                          setCaptchaToken(token);
                          setShowCaptcha(false);
                          setTimeout(() => {
                            const btn = document.getElementById('newsletter-submit-btn');
                            btn?.click();
                          }, 100);
                        }}
                        onExpire={() => setCaptchaToken(null)}
                        onError={() => {
                          setCaptchaToken(null);
                          setShowCaptcha(false);
                          toast.error("Captcha failed. Please try again.");
                        }}
                      />
                    </div>
                  )}

                  {status === "error" && (
                    <p className="mt-3 text-red-500 text-xs font-bold font-open-sans">
                      {errorMessage || "Please enter a valid email."}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
