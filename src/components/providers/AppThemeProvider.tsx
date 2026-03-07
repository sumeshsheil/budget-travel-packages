"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";

interface AppThemeProviderProps {
  children: React.ReactNode;
}

import { LazyMotion, domAnimation } from "motion/react";

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
