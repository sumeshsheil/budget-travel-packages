"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <Link
      href="/"
      className="block w-full bg-secondary hover:bg-secondary/95 transition-colors py-2 px-4"
    >
      <div className="container-box flex items-center justify-center text-white">
        <p className="text-[13px] text-center font-medium tracking-wide uppercase">
          Book your trip with <span className="font-black">Budget Travel Packages</span>{" "} <br className="md:hidden" />
          and get{" "}
          <span className="text-primary font-black">upto 50% off</span>
        </p>
      </div>
    </Link>
  );
}
