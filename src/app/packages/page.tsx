"use client";

import Footer from "@/components/landing/sections/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Reuse images from PopularPackages for placeholders
import adventureImg from "@/../public/images/banner/adventure.jpeg";
import familyImg from "@/../public/images/banner/family.jpeg";
import honeymoonImg from "@/../public/images/banner/honeymoon.jpeg";

const upcomingCategories = [
  {
    id: 1,
    title: "Family",
    image: familyImg,
    description: "Carefully curated family adventures.",
  },
  {
    id: 2,
    title: "Honeymoon",
    image: honeymoonImg,
    description: "Romantic getaways in dream destinations.",
  },
  {
    id: 3,
    title: "Adventure",
    image: adventureImg,
    description: "Thrilling treks and wild experiences.",
  },
];

const PackagesPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 bg-linear-to-br from-emerald-950 via-emerald-900 to-black" />

          <div className="container-box relative z-20 px-4 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <m.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-left max-w-2xl"
              >
                <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
                  Coming Soon
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-[80px] font-inter font-black text-white mb-6 tracking-tight leading-[0.9]">
                  Travel <br />
                  <span className="text-emerald-500">Packages</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed mb-10 max-w-lg">
                  We are curating the most exclusive deals for your next dream vacation. 
                  Something amazing is on its way!
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="h-14 px-8 bg-primary hover:bg-primary/90 text-black font-extrabold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                    <Link href="/#start-planning">Plan My Trip Now</Link>
                  </Button>
                </div>
              </m.div>

              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="relative hidden lg:block"
              >
                <div className="relative aspect-square max-w-[500px] ml-auto">
                    {/* Floating Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full animate-pulse delay-700" />
                    
                    <div className="relative h-full w-full rounded-[40px] overflow-hidden border-8 border-white/5 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 group bg-emerald-900">
                        <Image 
                            src={adventureImg} 
                            alt="Travel Experience" 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            placeholder="blur"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8">
                            <p className="text-white text-2xl font-black tracking-tight">Vibrant Destinations</p>
                            <p className="text-primary font-bold">Coming Early 2026</p>
                        </div>
                    </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        {/* Sneak Peek Section */}
        <section className="py-24 container-box px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-inter font-black text-black mb-4 tracking-tight">
              A Sneak Peek of What’s <span className="text-emerald-600">Coming</span>
            </h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {upcomingCategories.map((cat, index) => (
              <m.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative h-[500px] rounded-[48px] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-primary/20 transition-all duration-500"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-3xl font-inter font-extrabold text-white mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-white/70 text-base font-medium transition-all duration-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* Simple CTA Section */}
        <section className="py-24 text-center bg-slate-50 border-y border-slate-100">
          <div className="container-box px-4 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-black text-black mb-6 tracking-tight">Ready to explore the world?</h3>
            <p className="text-slate-600 mb-10 text-lg font-medium leading-relaxed">
              We&apos;re working hard to bring you the best travel experience in India. 
              In the meantime, our travel experts are ready to help you plan your customized trip.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild className="h-14 px-10 rounded-2xl bg-black text-white font-bold hover:bg-slate-900 transition-all shadow-xl">
                  <a href="mailto:hello@budgettravelpackages.in">Contact Support</a>
                </Button>
                <Button asChild variant="outline" className="h-14 px-10 rounded-2xl border-2 border-slate-200 text-black font-bold hover:bg-white transition-all">
                  <Link href="/#faqs">Go to FAQ</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PackagesPage;
