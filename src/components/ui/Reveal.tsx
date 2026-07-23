"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from "react";

/**
 * Scroll reveal.
 *
 * Deliberately CSS-driven rather than Motion-driven: Motion serialises its
 * `initial` state into the SSR markup, so a client without working JS (or with
 * a throttled/background tab) would be left staring at opacity:0 content.
 * Here the markup ships visible, and the `.js` class set by the head script is
 * what opts an element into being hidden-then-revealed.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  y = 20,
}: {
  children: ReactNode;
  /** Stagger offset in seconds — use the item index for lists. */
  delay?: number;
  className?: string;
  as?: ElementType;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support: reveal on the next tick rather than synchronously,
    // which would cascade a render from inside the effect body.
    if (!("IntersectionObserver" in window)) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits a heading into words and lifts each one in sequence.
 * Pure CSS animation, so it also plays without JS and self-disables under
 * prefers-reduced-motion.
 */
export function RevealWords({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
  id,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  id?: string;
}) {
  const words = text.split(" ");

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="word-clip">
            <span className="word-rise" style={{ animationDelay: `${delay + i * 0.05}s` }}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
