"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface ScrollToButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  targetId: string;
  children: React.ReactNode;
}

export function ScrollToButton({
  targetId,
  children,
  variant,
  size,
  className,
  ...props
}: ScrollToButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}
