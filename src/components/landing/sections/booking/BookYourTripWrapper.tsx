"use client";

import dynamic from "next/dynamic";

const BookYourTripContent = dynamic(() => import("./BookYourTripSection"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center bg-white">
      <div className="text-xl font-bold text-primary animate-pulse">Loading booking form...</div>
    </div>
  ),
});

export function BookYourTrip() {
  return <BookYourTripContent />;
}
