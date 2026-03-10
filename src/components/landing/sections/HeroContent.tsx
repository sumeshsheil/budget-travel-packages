"use client";

import { m } from "motion/react";
import React from "react";
import Button from "../ui/button";

const HeroContent: React.FC = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.07, ease: "easeIn" }}
      // Force hardware acceleration before the animation starts
      className="flex flex-col items-center transform-gpu will-change-transform"
    >
      {/* Removed drop-shadow-lg, recommend standard text-shadow via custom CSS if needed */}
      <h1 className="text-white max-w-5xl xl:max-w-6xl font-inter font-extrabold text-4xl md:text-6xl leading-tight tracking-tight">
        Customized Domestic & International Tour Plan with{" "}
        <span className="text-primary">Budget Travel Packages</span>
      </h1>

      <p className="font-open-sans font-semibold text-lg md:text-2xl lg:text-[40px] mt-6 mb-8 max-w-4xl text-white/90 px-4 leading-relaxed">
        Book customized domestic & international vacation plan from India.
      </p>

      <div className="inline-block px-6 py-2 mb-6">
        <p className="font-open-sans font-bold text-accent text-lg md:text-2xl lg:text-[48px] tracking-wide">
          Explore More, Spend Less!
        </p>
      </div>
      <Button
        variant="primary"
        className="bg-new-blue text-white  text-sm md:text-base px-8 lg:px-16 py-2 rounded-full transition-all"
        onClick={() => {
          document
            .getElementById("start-planning")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Customize My Trip
      </Button>

    </m.div>
  );
};

export default HeroContent;
