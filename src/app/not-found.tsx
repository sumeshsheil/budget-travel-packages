import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Budget Travel Packages",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d1f0d 0%, #12240e 60%, #1a0303 100%)",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(1,255,112,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(152,5,11,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "560px",
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(1,255,112,0.15)",
          borderRadius: "1.5rem",
          padding: "3rem 2.5rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(1,255,112,0.05)",
        }}
      >
        {/* Compass icon */}
        <div
          aria-hidden="true"
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            filter: "drop-shadow(0 0 20px rgba(1,255,112,0.5))",
          }}
        >
          🧭
        </div>

        {/* 404 */}
        <div
          style={{
            fontSize: "clamp(5rem, 15vw, 9rem)",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, #01ff70 0%, #fed618 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>

        <h1
          style={{
            color: "#f0f0f0",
            fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            letterSpacing: "-0.01em",
          }}
        >
          Lost on the Map
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "2.25rem",
            fontFamily: "var(--font-open-sans, sans-serif)",
          }}
        >
          Looks like this destination doesn&apos;t exist. The page may have moved,
          been removed, or the link might be incorrect.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#01ff70",
              color: "#0d1f0d",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.7rem 1.75rem",
              borderRadius: "0.75rem",
              textDecoration: "none",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            ← Back to Home
          </Link>

          <Link
            href="/blogs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              color: "#01ff70",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "0.7rem 1.75rem",
              borderRadius: "0.75rem",
              border: "1.5px solid rgba(1,255,112,0.35)",
              textDecoration: "none",
              transition: "border-color 0.2s, transform 0.2s",
            }}
          >
            Travel Blog
          </Link>
        </div>
      </div>

      {/* Footer hint */}
      <p
        style={{
          marginTop: "2rem",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.8rem",
          zIndex: 1,
          position: "relative",
        }}
      >
        Error 404 · Budget Travel Packages
      </p>
    </main>
  );
}
