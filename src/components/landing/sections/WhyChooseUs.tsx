"use client";

import { m } from "motion/react";
import Image from "next/image";
import React from "react";
import Button from "../ui/button";

import bgPattern from "@/../public/images/why-choose-us/background.svg";
import icon1 from "@/../public/images/why-choose-us/icon1.svg";
import icon2 from "@/../public/images/why-choose-us/icon2.svg";
import icon3 from "@/../public/images/why-choose-us/icon3.svg";
import icon4 from "@/../public/images/why-choose-us/icon4.svg";
import icon5 from "@/../public/images/why-choose-us/icon5.svg";
import icon6 from "@/../public/images/why-choose-us/icon6.svg";
import LottieAnimation from "@/components/ui/LottieAnimation";

const features = [
  {
    id: 1,
    title: "Transparent Pricing",
    description: "No hidden charges, no last-minute surprises",
    icon: icon1,
  },
  {
    id: 2,
    title: "Personalized Travel Planning",
    description: "Trips customized to your budget & preferences",
    icon: icon2,
  },
  {
    id: 3,
    title: "End-to-End Support",
    description: "Assistance from planning to return journey",
    icon: icon3,
  },
  {
    id: 4,
    title: "Best Value for Money",
    description: "Smart planning to maximize your travel experience",
    icon: icon4,
  },
  {
    id: 5,
    title: "Trusted by travelers across India",
    description: "We proudly serve across 75+ cities in India",
    icon: icon5,
  },
  {
    id: 6,
    title: "Hassle-Free Bookings",
    description: "We handle everything for you",
    icon: icon6,
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section
      id="why-choose-us"
      className="lg:py-20 relative bg-white overflow-hidden scroll-mt-24"
    >
      <div id="about" className="scroll-mt-24" />
      <div className="relative z-10 mb-0 md:mb-16 px-4 flex flex-col md:flex-row md:flex-wrap  md:gap-x-10 xl:block">
              {/* Plane Animation */}
              <div className="order-1 md:order-1 relative xl:absolute xl:top-2 xl:left-0 2xl:left-10 w-48 md:w-72 mx-auto xl:mx-0 pointer-events-none mt-0 md:mt-0 -scale-x-100">
                <LottieAnimation
                  src="/animations/plane.json"
                  width="100%"
                  height="auto"
                  className="w-full h-auto opacity-65"
                />
              </div>
              {/* Header */}
              <div className="text-center order-2 md:order-2 md:w-full xl:w-auto">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] xl:text-[48px] font-inter font-semibold text-black leading-tight mb-6">
                  Why Budget Travel Packages Is One Of
                  <br className="hidden md:block" /> The{" "}
                  <span className="text-primary">
                    Best Travel Companies In India?
                  </span>
                </h2>
                
              </div>
            </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgPattern}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="container-box relative z-10 px-4">
        {/* Header */}
        

        {/* Features Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <m.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className=" border border-secondary rounded-[10px] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg md:text-xl text-black mb-3 font-inter">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-[250px]">
                  {feature.description}
                </p>
              </m.div>
            ))}
          </div>
                  <div className=" bg-accent w-fit mx-auto flex flex-col items-center px-6 py-2.5 mb-4 rounded-full">
                  <p className="font-semibold font-inter w-fit  text-red-700 text-lg md:text-xl lg:text-2xl">
                    Pan-India Multi-City Services
                  </p>
                </div>
                <p className="text-base md:text-lg mb-3 text-center max-w-[800px] mx-auto font-inter font-semibold text-gray-800">
                  We proudly serve travelers across 75+ cities in India, with the
                  highest number of satisfied customers from Kolkata, Delhi, and
                  Mumbai.
                </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              document
                .getElementById("start-planning")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-new-blue text-white font-bold py-3 px-10 rounded-full hover:shadow-lg transition-shadow text-base md:text-lg"
          >
            Customize My Trip
          </Button>
        </div>

          {/* Train Animation - Moved to bottom right */}
          <div className="xl:absolute flex items-center justify-center mx-auto 2xl:-right-18 2xl:bottom-10 xl:-right-20 xl:bottom-0  w-[240px] pointer-events-none z-20 -scale-x-100">
            <LottieAnimation
              src="/animations/train.json"
              width="100%"
              height="auto"
              className="w-full h-auto opacity-80"
              loop={true}
              autoplay={true}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
