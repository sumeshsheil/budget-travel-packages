"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import React from "react";

interface AppThemeProviderProps {
  children: React.ReactNode;
}

import { domAnimation, LazyMotion } from "motion/react";

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const pathname = usePathname();

  // Public routes that should always be in light mode
  // This includes the landing page, blog pages, thank you page, etc.
  // Essentially everything EXCEPT the dashboard and admin panels.
  const isPublicRoute =
    !pathname?.startsWith("/dashboard") && !pathname?.startsWith("/admin");

  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={!isPublicRoute}
        forcedTheme={isPublicRoute ? "light" : undefined}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </LazyMotion>
  );
}
