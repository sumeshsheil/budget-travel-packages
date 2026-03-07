import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Privacy Policy, Terms & Conditions, and other legal information for Budget Travel Packages.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
