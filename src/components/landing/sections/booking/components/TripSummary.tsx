"use client";

import React, { useState } from "react";

interface TripSummaryProps {
  step1: {
    destination: string;
    travelDate: string;
    duration: string;
    guests: number | string;
    budget: number | string;
  };
}

export const TripSummary: React.FC<TripSummaryProps> = ({ step1 }) => {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setShowSummary(!showSummary)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors text-left cursor-pointer"
      >
        <span className="font-bold text-primary text-sm flex items-center gap-2">
          <span className="text-lg">📋</span> Trip Summary
        </span>
        <span className="text-primary/60 text-xs font-medium">
          {showSummary ? "Hide Details ▲" : "Show Details ▼"}
        </span>
      </button>

      {showSummary && (
        <div className="p-4 grid grid-cols-2 gap-4 text-xs sm:text-sm border-t border-primary/10 bg-white/50 animate-in slide-in-from-top-2">
          <div>
            <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
              Destination
            </span>
            <span className="font-semibold text-gray-800">
              {step1.destination}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
              Dates
            </span>
            <span className="font-semibold text-gray-800">
              {step1.travelDate} ({step1.duration})
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
              Guests
            </span>
            <span className="font-semibold text-gray-800">
              {step1.guests} People
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-[10px] uppercase tracking-wider">
              Budget
            </span>
            <span className="font-semibold text-gray-800">
              ₹{step1.budget}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
