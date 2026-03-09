"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowRight, Globe, Rocket, Sparkles, Star, Zap
} from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PackagesPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const isPaidUser =
    session?.user?.plan &&
    session?.user?.plan !== "free" &&
    session?.user?.subscriptionStatus === "active";

  if (!isPaidUser) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl">
      {/* Background Aesthetic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse decoration-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 dark:opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl w-full px-6 py-12 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold uppercase tracking-widest rounded-full">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Premium Feature
          </Badge>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Curated <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent italic">Packages</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed font-sans">
            Our luxury travel experts are curating exclusive, all-inclusive budget travel packs tailored just for our premium members.
          </p>
        </motion.div>

        {/* Glassmorphic Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          {[
            {
              icon: Globe,
              title: "Exclusive Deals",
              desc: "Hand-picked destinations with prices you won't find anywhere else."
            },
            {
              icon: Zap,
              title: "Priority Booking",
              desc: "Get 48-hour early access to seasonal holiday packs before they sell out."
            },
            {
              icon: Star,
              title: "VIP Support",
              desc: "Direct line to our senior consultants for every package booking."
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            >
              <Card className="h-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action / Coming Soon Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="bg-slate-900 dark:bg-emerald-950/20 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Rocket className="w-24 h-24 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-2">Content is coming very soon</h2>
              <p className="text-emerald-200/70 text-sm max-w-[400px]">
                We're currently finalising partnerships with luxury resorts. You'll be notified as soon as the first pack drops.
              </p>
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 rounded-xl text-md font-bold transition-all shadow-lg shadow-emerald-500/20">
              Get Notified
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
