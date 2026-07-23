"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent, type Ref } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const sizeClass: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  /** Pulls the button gently toward the cursor. Ignored when motion is reduced. */
  magnetic?: boolean;
};

const MotionLink = motion.create(Link);

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  magnetic = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const pull = (e: MouseEvent) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.2);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.26);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `btn ${variantClass[variant]} ${sizeClass[size]} ${className}`;
  const style = reduce ? undefined : { x: sx, y: sy };

  const inner = (
    <>
      <span className={`inline-flex items-center gap-[var(--spacing-3)] ${loading ? "invisible" : ""}`}>
        {children}
      </span>
      {loading && (
        <span
          aria-hidden
          className="absolute size-[18px] animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    const shared = {
      className: cls,
      style,
      onMouseMove: pull,
      onMouseLeave: release,
      whileTap: reduce ? undefined : { scale: 0.97 },
    };

    return external ? (
      <motion.a ref={ref as Ref<HTMLAnchorElement>} href={href} {...shared}>
        {inner}
      </motion.a>
    ) : (
      <MotionLink ref={ref as Ref<HTMLAnchorElement>} href={href} {...shared}>
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      style={style}
      onMouseMove={pull}
      onMouseLeave={release}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {inner}
    </motion.button>
  );
}

/** Inline text link with a persistent underline affordance and a nudging arrow. */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const cls =
    "group inline-flex min-h-6 items-center gap-[var(--spacing-2)] font-[550] text-fg-strong " +
    `border-b border-line pb-0.5 transition-colors duration-[var(--motion-fast)] hover:border-current ${className}`;

  const inner = (
    <>
      {children}
      <span
        aria-hidden
        className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
