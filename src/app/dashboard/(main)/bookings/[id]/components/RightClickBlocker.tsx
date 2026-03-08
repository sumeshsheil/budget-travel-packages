"use client";

import React from "react";

interface RightClickBlockerProps {
  children: React.ReactNode;
  className?: string;
}

export default function RightClickBlocker({ children, className }: RightClickBlockerProps) {
  return (
    <div 
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (e.button === 2) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={className}
    >
      {children}
    </div>
  );
}
