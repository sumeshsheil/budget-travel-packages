"use client";

import React from "react";

import dynamic from "next/dynamic";
import { BookingFormCard } from "./components/BookingFormCard";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import parachuteAnimation from "@/../public/animations/parachute.json";

const BookYourTripSection: React.FC = () => {
  return (
    <section
      id="start-planning"
      className="pb-20 pt-50 2xl:pt-10 2xl:pb-10 relative bg-white scroll-mt-24"
    >
      {/* Decorative Parachute Lottie (Left Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 2xl:left-40 2xl:top-20 w-64 2xl:w-100 opacity-80 pointer-events-none z-0">
        <Lottie
          animationData={parachuteAnimation}
          loop
          autoplay
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>

      <div className="container-box relative z-10 px-4">
        <div className="text-center mb-10 lg:mb-16">
          <h3 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black">
            Start Planning <span className="text-primary">Your Trip</span>
          </h3>
        </div>

        <BookingFormCard />
        
      </div>

    </section>
  );
};

export default BookYourTripSection;
