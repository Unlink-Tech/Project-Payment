"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";

import { nav } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { BrandLockup } from "@/components/ui/BrandMark";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  // Close on route change. Adjusted during render rather than in an effect,
  // so the menu never paints open on the page we just navigated to.
  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (routeAtOpen !== pathname) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  // Escape closes and returns focus to the trigger; body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      /* Transparent over the hero, then solid black once scrolled. Solid rather
         than translucent so the page glow never bleeds through the logo mark. */
      className={`sticky top-0 z-50 border-b transition-colors duration-[var(--motion-fast)] ${
        scrolled ? "border-line bg-surface" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex min-h-18 items-center justify-between gap-[var(--spacing-8)]">
        <BrandLockup />

        <nav aria-label="Primary" className="hidden items-center gap-[var(--spacing-1)] lg:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="nav-link"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-hover"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${active ? "text-fg-strong" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-[var(--spacing-5)]">
          <Button href="/contact" size="sm" className="hidden sm:inline-flex" magnetic={false}>
            Start a conversation
          </Button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="icon-btn lg:hidden"
          >
            <span aria-hidden className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1/2 left-0 block h-0.5 w-full -translate-y-1/2 bg-current transition-opacity duration-[var(--motion-instant)] ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full border-b border-line
                       bg-surface lg:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex flex-col py-[var(--spacing-6)]">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between border-b border-line
                                text-xl transition-colors duration-[var(--motion-fast)]
                                ${isActive(item.href) ? "text-fg-strong" : "text-fg-muted"}`}
                  >
                    {item.label}
                    <span aria-hidden className="text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <Button href="/contact" size="lg" className="mt-[var(--spacing-8)] w-full" magnetic={false}>
                Start a conversation
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
