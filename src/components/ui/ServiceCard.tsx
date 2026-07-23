"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "motion/react";

import type { Service } from "@/lib/site";

/**
 * Service card.
 *
 * At rest it is a plain surface card. On hover — or when anything inside it is
 * focused, so keyboard users get the same treatment — related artwork fades in
 * behind the content with a scrim that keeps text contrast intact, and the
 * capability list gives way to the service's one-line promise.
 */
export function ServiceCard({ service }: { service: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(247,158,27,0.18), transparent 70%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="service-card group/card relative isolate flex h-full flex-col overflow-hidden
                 rounded-[var(--radius-sm)] border border-line bg-raised
                 p-[var(--spacing-9)] transition-colors duration-[var(--motion-normal)]
                 hover:border-line-strong focus-within:border-focus"
    >
      {/* Artwork — decorative, so it stays out of the accessibility tree. */}
      <div aria-hidden className="service-card__art pointer-events-none absolute inset-0 -z-10">
        <Image
          src={service.art}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
        {/* Scrim: keeps body copy above 4.5:1 once the artwork is showing. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_top,var(--card-scrim-strong)_0%,var(--card-scrim)_55%,var(--card-scrim-top)_100%)]" />
      </div>

      {!reduce && (
        <motion.span
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity
                     duration-[var(--motion-normal)] group-hover/card:opacity-100"
        />
      )}

      <span className="text-sm font-[550] tracking-[0.1em] text-accent">{service.index}</span>

      <h3 className="t-h3 mt-[var(--spacing-6)] text-fg-strong">{service.title}</h3>

      <p className="t-body mt-[var(--spacing-6)]">{service.summary}</p>

      {/* Capabilities at rest; the promise line takes their place on hover. */}
      <div className="service-card__swap relative mt-[var(--spacing-6)] flex-1">
        <ul className="service-card__list grid gap-[var(--spacing-3)]">
          {service.capabilities.slice(0, 3).map((c) => (
            <li key={c} className="flex gap-[var(--spacing-5)] text-sm text-fg-muted">
              <span aria-hidden className="text-accent">
                &middot;
              </span>
              {c}
            </li>
          ))}
        </ul>

        <p aria-hidden className="service-card__promise absolute inset-0 flex items-start">
          <span className="text-lg leading-[1.4] font-[550] text-fg-strong">{service.hoverLine}</span>
        </p>
      </div>

      <p className="mt-[var(--spacing-8)]">
        <Link
          href={`/services#${service.slug}`}
          className="group/link inline-flex min-h-6 items-center gap-[var(--spacing-2)] border-b
                     border-line pb-0.5 font-[550] text-fg-strong transition-colors
                     duration-[var(--motion-fast)] hover:border-current"
        >
          <span className="sr-only">{service.title}: </span>
          See the detail
          <span
            aria-hidden
            className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)]
                       group-hover/link:translate-x-1"
          >
            →
          </span>
        </Link>
      </p>
    </motion.div>
  );
}
