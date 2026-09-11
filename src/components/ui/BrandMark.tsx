import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

import logo from "../../../public/PP-logo.png";

/**
 * The full logo lockup (mark + wordmark).
 *
 * The site is dark-only, so the glow artwork ships as-is; its transparent
 * margins are trimmed so `height` sizes the wordmark itself.
 * `PP-logo-dark.svg` (black wordmark) is kept in /public for a light theme.
 */
export function BrandMark({ className = "", height = 26 }: { className?: string; height?: number }) {
  return (
    <span className={`block w-auto shrink-0 ${className}`} style={{ height }}>
      <Image src={logo} alt="" aria-hidden priority className="h-full w-auto" />
    </span>
  );
}

export function BrandLockup({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center text-fg-strong ${className}`}
      aria-label={`${site.name} home`}
    >
      <BrandMark
        height={29}
        className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:scale-105"
      />
    </Link>
  );
}
