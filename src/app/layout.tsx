import { StoreProvider } from "@/lib/redux/StoreProvider";
import { Metadata, Viewport } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

import { AppThemeProvider } from "@/components/providers/AppThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";

const FloatingButtons = dynamic(
  () =>
    import("@/components/layout/FloatingButtons").then(
      (mod) => mod.FloatingButtons,
    ),
  // { ssr: false }, // No need to server-side render floating lottie files
);
export const viewport: Viewport = {
  themeColor: "#01FF70",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://budgettravelpackages.in"),
  title: {
    default: "Budget Travel Packages India | Affordable Trips Worldwide",
    template: "%s | Budget Travel Packages",
  },
  description:
    "Discover affordable domestic and international travel packages. Get custom itineraries, compare deals, and book your dream vacation with Budget Travel Packages.",
  keywords: [
    "Budget Travel Packages",
    "Customized Tour Packages",
    "Travel Agency Kolkata",
    "International Tour Packages",
    "Domestic Travel India",
    "Holiday Packages",
    "Vacation Planner",
  ],
  authors: [{ name: "Budget Travel Packages" }],
  creator: "Budget Travel Packages",
  publisher: "Budget Travel Packages",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Budget Travel Packages India | Affordable Trips Worldwide",
    description:
      "Discover affordable domestic and international travel packages. Get custom itineraries, compare deals and book your dream vacation with Budget Travel Packages.",
    url: "https://budgettravelpackages.in",
    siteName: "Budget Travel Packages",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.svg", 
        width: 800,
        height: 600,
        alt: "Budget Travel Packages Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Travel Packages India | Affordable Trips Worldwide",
    description:
      "Discover affordable domestic and international travel packages. Get custom itineraries, compare deals, and book your dream vacation with Budget Travel Packages.",
    images: ["/images/logo/logo.svg"], 
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import CookieConsent from "@/components/layout/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Budget Travel Packages",
    image: "https://budgettravelpackages.in/images/logo/logo.svg",
    "@id": "https://budgettravelpackages.in",
    url: "https://budgettravelpackages.in",
    telephone: "+919242868839",
    email: "hello@budgettravelpackages.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bengal Eco Intelligent Park, EM Block, Sector V",
      addressLocality: "Bidhannagar, Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700091",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.5726,
      longitude: 88.4374,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://www.facebook.com/budgettravelpackages",
      "https://www.instagram.com/budgettravelpackages.in",
      "https://www.youtube.com/@budgettravelpackages",
    ],
    priceRange: "₹500 - ₹500000",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PP3L5HBW');`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${openSans.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PP3L5HBW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppThemeProvider>
          <StoreProvider>
            <SessionProvider>
                {children}
                <CookieConsent />
                <FloatingButtons />
                <Toaster richColors position="top-right" />
            </SessionProvider>
          </StoreProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
