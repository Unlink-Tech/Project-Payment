"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "motion/react";

/**
 * Surface card with a cursor-tracked spotlight and a slight 3D tilt.
 * Both effects are pointer-only enhancements; the card is fully usable without them.
 */
export function Card({
  children,
  className = "",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}% ${my}%, var(--glow-2), transparent 70%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (tilt) {
      rx.set((0.5 - py) * 6);
      ry.set((px - 0.5) * 6);
    }
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group relative flex h-full flex-col gap-[var(--spacing-6)] overflow-hidden rounded-[var(--radius-sm)]
                  border border-line bg-raised p-[var(--spacing-9)]
                  transition-colors duration-[var(--motion-fast)] hover:border-line-strong
                  focus-within:border-focus ${className}`}
    >
      {!reduce && (
        <motion.span
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[var(--motion-normal)] group-hover:opacity-60"
        />
      )}
      <div className="relative flex h-full flex-col gap-[var(--spacing-6)]">{children}</div>
    </motion.div>
  );
}
