"use client";

import dynamic from "next/dynamic";
import React from "react";

const FloatingButtons = dynamic(
  () =>
    import("@/components/layout/FloatingButtons").then(
      (mod) => mod.FloatingButtons,
    ),
  { ssr: false },
);

const CookieConsent = dynamic(
  () => import("@/components/layout/CookieConsent"),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false },
);

export function ClientSideComponents() {
  return (
    <>
      <CookieConsent />
      <FloatingButtons />
      <Toaster richColors position="top-right" />
    </>
  );
}
