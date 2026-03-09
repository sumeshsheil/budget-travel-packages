"use client";

import HeroBg from "@/../public/images/heros/hero-background.png";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const HeroBackground: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

  return (
    <div className="absolute h-[calc(100dvh-54px)] w-full z-0 inset-0 overflow-hidden bg-black">
      {/* Placeholder Image - Always rendered first for LCP */}
      <Image
        src={HeroBg}
        alt="Scenic travel destination background"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Background Video - Fades in when ready, GPU Accelerated */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata" // Changed from auto: downloads metadata first, saving initial bandwidth
        poster="/images/heros/hero-background.png"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 transform-gpu will-change-opacity ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/hero-background-video.mp4" type="video/mp4" />
      </video> 
    </div>
  );
};

export default HeroBackground;