"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Group thousands. Leave off for year values like 2021. */
  format?: boolean;
  className?: string;
};

/**
 * Counts up to `value` when scrolled into view.
 *
 * Starts at the final value so server-rendered markup, a no-JS client, and a
 * throttled background tab all show the real number; the count-up only takes
 * over once the animation frame actually runs.
 */
export function Counter({ value, prefix = "", suffix = "", format = false, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    let frame = 0;
    let start = 0;
    const duration = 1400;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // easeOutExpo
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format ? display.toLocaleString("en-US") : display}
      {suffix}
    </span>
  );
}
