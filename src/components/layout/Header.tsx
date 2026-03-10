"use client";
import {
    AnimatePresence, motion, useMotionValueEvent, useScroll
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import MenuIcon from "../icons/Menu";

import { SOCIAL_LINKS } from "@/lib/constants";
import YoutubeIcon from "../icons/Youtube";
import { Button } from "../ui/button";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoginModal from "../auth/LoginModal";

function SearchParamsHandler({ onOpenLogin }: { onOpenLogin: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const action = searchParams.get("action");
    const login = searchParams.get("login");

    if ((token && action === "set-password") || login === "true") {
      onOpenLogin();
    }
  }, [searchParams, onOpenLogin]);

  return null;
}

// Logos
import logoFooter from "@/../public/images/logo/footer-logo.svg";
import logoPrimary from "@/../public/images/logo/logo.svg";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 10;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  const isHomePage = pathname === "/" || pathname === "/packages";

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openLoginModal = React.useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.07, ease: "easeIn" }}
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 transform-gpu will-change-transform ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-3 shadow-lg border-b border-white/10"
            : "py-5 bg-linear-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="container-box flex items-center justify-between relative">
          <div className="relative z-50">
            <Link
              href="/"
              aria-label="Home"
              className="block relative w-32 sm:w-40 md:w-48 lg:w-60 h-10 sm:h-12 md:h-14 lg:h-16"
            >
              <Image
                src={logoPrimary}
                alt="Budget Travel Packages Logo"
                fill
                priority={isHomePage}
                className={`object-contain transition-opacity duration-300 transform-gpu ${
                  isHomePage || isScrolled ? "opacity-100" : "opacity-0"
                }`}
              />
              {!isHomePage && (
                <Image
                  src={logoFooter}
                  alt="Budget Travel Packages Logo (Dark)"
                  fill
                  className={`object-contain transition-opacity duration-300 transform-gpu ${
                    !isScrolled ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </Link>
          </div>
          <nav
            aria-label="Social Media"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 hidden sm:block"
          >
            <div className="flex items-center gap-2 md:gap-4 text-white">
              <Link
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 transform-gpu"
                aria-label="Follow us on Facebook"
              >
                <Image
                  src="/images/footer/social/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all object-contain"
                />
              </Link>
              <Link
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 transform-gpu"
                aria-label="Follow us on Instagram"
              >
                <Image
                  src="/images/footer/social/instagram-2.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all object-contain"
                />
              </Link>
              <Link
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 transform-gpu"
                aria-label="Subscribe to our YouTube channel"
              >
                <YoutubeIcon className="w-auto h-5 md:h-6 transition-all" />
              </Link>
            </div>
          </nav>
          <div>
            <div className="flex items-center gap-4 min-h-8">
              <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={toggleMenu}
                className="focus:outline-none cursor-pointer transform-gpu will-change-transform"
                aria-label="Toggle Menu"
              >
                <MenuIcon className="text-[#01FF70]" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="absolute right-4 top-16 md:top-20 mt-6 bg-white rounded-2xl shadow-xl overflow-hidden z-50 w-60 origin-top-right border border-gray-100 transform-gpu will-change-transform"
            >
              <div className="p-6 flex flex-col gap-6">
                <ul className="flex flex-col items-center gap-4">
                  <Button
                    className="w-full text-white"
                    variant="secondary"
                    onClick={() => {
                      if (session) {
                        router.push("/dashboard");
                      } else {
                        setIsOpen(false);
                        setIsLoginModalOpen(true);
                      }
                    }}
                  >
                    My Account
                  </Button>
                  <div className="w-full bg-gray-600 h-px" />
                  {[
                    { href: "/#kolkata", label: "Kolkata" },
                    { href: "/#delhi", label: "Delhi" },
                    { href: "/#mumbai", label: "Mumbai" },
                    { href: "/#travel-purpose", label: "Travel Purpose" },
                    { href: "/#start-planning", label: "Customize Trip" },
                    { href: "/#services", label: "What's Included?" },
                    { href: "/#why-choose-us", label: "Why Choose Us?" },
                    { href: "/#faqs", label: "FAQs" },
                    { href: "/#travel-smart", label: "Contact" },
                    { href: "/#contact", label: "About" },
                  ].map((link, index) => (
                    <motion.li
                      key={`${link.href}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transform-gpu will-change-transform w-full text-center"
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="block w-full py-1 text-secondary-text hover:text-primary transition-colors font-semibold text-sm md:text-base font-open-sans"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Social Icons */}
                <div className="sm:hidden pt-4 border-t border-gray-100 flex flex-col items-center">
                  <p className="text-secondary-text text-sm font-semibold mb-3">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-6 text-white">
                    <Link
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform transform-gpu"
                    >
                      <Image
                        src="/images/footer/social/facebook.png"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform transform-gpu"
                    >
                      <Image
                        src="/images/footer/social/instagram-2.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform transform-gpu"
                    >
                      <YoutubeIcon className="w-auto h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={null}>
          <SearchParamsHandler onOpenLogin={openLoginModal} />
        </Suspense>
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </Suspense>
      </motion.header>
    </>
  );
};

export default Header;