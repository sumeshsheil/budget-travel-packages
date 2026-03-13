"use client";

import React from "react";

import { StoreProvider } from "@/lib/redux/StoreProvider";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { BookingFormCard } from "./components/BookingFormCard";

const BookYourTripSection: React.FC = () => {
  return (
    <StoreProvider>
      <section
        id="start-planning"
        className="pb-20 pt-50 2xl:pt-10 2xl:pb-10 relative bg-white scroll-mt-24"
      >
      {/* Decorative Parachute Lottie (Left Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 2xl:left-40 2xl:top-20 w-64 2xl:w-100 opacity-80 pointer-events-none z-0">
        <LottieAnimation
          src="/animations/parachute.json"
          loop
          autoplay
          className="w-full h-auto"
        />
      </div>

      <div className="container-box relative z-10 px-4">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black">
            Start Planning <span className="text-primary">Your Trip</span>
          </h2>
        </div>

        <BookingFormCard />
        
      </div>

    </section>
    </StoreProvider>
  );
};

export default BookYourTripSection;
