"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

import { differentiators } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/Button";

/**
 * "Why Ease Plus", argued as a contrast.
 *
 * A list of adjectives asks the reader to take our word for it; naming the
 * common practice next to ours lets them judge the difference themselves.
 * A scroll-linked rail tracks progress through the four dimensions.
 */
export function WhyUs() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 60%"],
  });
  const railScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <section className="section-y border-t border-line" aria-labelledby="why-title">
      <div className="container-site grid gap-[var(--spacing-11)] lg:grid-cols-[0.85fr_1.15fr]">
        {/* Sticky argument */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal as="p" className="t-eyebrow">
            Why Ease Plus
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="why-title" className="t-h1 mt-[var(--spacing-6)]">
              Independent advice, or it isn&apos;t advice
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-body mt-[var(--spacing-7)]">
              Most advisory in this market is paid for twice: once by you, and once by the vendor
              being recommended. Here is what we do differently, line by line.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-[var(--spacing-9)]">
            <ArrowLink href="/about">Read about our approach</ArrowLink>
          </Reveal>
        </div>

        {/* Comparison ledger */}
        <div className="relative">
          {/* Progress rail */}
          <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-[var(--border-subtle)]">
            <motion.div
              className="h-full w-px origin-top bg-[linear-gradient(to_bottom,var(--color-brand-600),var(--color-brand-400))]"
              style={reduce ? { scaleY: 1 } : { scaleY: railScale }}
            />
          </div>

          <ol ref={listRef} className="grid">
            {differentiators.map((item, i) => (
              <li key={item.dimension}>
                <Reveal delay={i * 0.06}>
                  <div
                    className="why-row group relative border-b border-line py-[var(--spacing-9)]
                               pl-[var(--spacing-9)] transition-colors duration-[var(--motion-normal)]"
                  >
                    {/* Marker on the rail */}
                    <span
                      aria-hidden
                      className="absolute top-[var(--spacing-11)] -left-[5px] size-[10px] rounded-full
                                 bg-[var(--surface-base)] ring-2 ring-[var(--border-strong)]
                                 transition-all duration-[var(--motion-normal)]
                                 group-hover:bg-[var(--color-brand-400)] group-hover:ring-[var(--color-brand-400)]"
                    />

                    <div className="flex flex-wrap items-baseline gap-x-[var(--spacing-6)] gap-y-[var(--spacing-2)]">
                      <span className="text-xs font-[550] tracking-[0.14em] text-accent uppercase">
                        {item.dimension}
                      </span>
                      <h3 className="t-h3 text-fg-strong">{item.title}</h3>
                    </div>

                    <dl className="mt-[var(--spacing-7)] grid gap-[var(--spacing-6)] sm:grid-cols-2">
                      <div className="grid gap-[var(--spacing-2)]">
                        <dt className="flex items-center gap-[var(--spacing-3)] text-xs tracking-[0.1em] text-fg-muted uppercase">
                          <span
                            aria-hidden
                            className="grid size-4 place-items-center rounded-full border border-[var(--border-strong)] text-[10px] leading-none"
                          >
                            ✕
                          </span>
                          Common practice
                        </dt>
                        <dd className="text-sm leading-[1.6] text-fg-muted">{item.usual}</dd>
                      </div>

                      <div className="grid gap-[var(--spacing-2)]">
                        <dt className="flex items-center gap-[var(--spacing-3)] text-xs tracking-[0.1em] text-accent uppercase">
                          <span
                            aria-hidden
                            className="grid size-4 place-items-center rounded-full border border-current text-[10px] leading-none"
                          >
                            ✓
                          </span>
                          Ease Plus
                        </dt>
                        <dd className="text-[var(--text-md)] leading-[1.6] font-[550] text-fg-strong">
                          {item.ours}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
