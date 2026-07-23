"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "motion/react";

import { process } from "@/lib/site";
import { SectionHead } from "@/components/sections/SectionHead";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Engagement timeline.
 *
 * The four phases are laid on a track whose progress line fills as the section
 * scrolls, lighting each node as it passes. Adds the two things a buyer
 * actually wants from a process diagram: how long each phase takes, and what
 * they are holding at the end of it.
 */
export function Process({
  eyebrow = "How we work",
  title = "Findings you can act on this quarter",
  lead = "Every engagement runs the same four movements, so you always know what happens next, how long it takes, and what you are holding at the end of it.",
  id = "approach-title",
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  id?: string;
} = {}) {
  const trackRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [reached, setReached] = useState(reduce ? process.length : 0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 85%", "end 65%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  useMotionValueEvent(fill, "change", (v) => {
    // A node lights once the fill has passed its position on the track.
    const count = Math.min(process.length, Math.floor(v * process.length) + 1);
    setReached((prev) => (count > prev ? count : prev));
  });

  return (
    <section className="section-y border-t border-line" aria-labelledby={id}>
      <div className="container-site">
        <SectionHead id={id} eyebrow={eyebrow} title={title} lead={lead} />

        <div className="relative">
          {/* Track. Vertical beside the phases on medium screens, horizontal across
              them on large. Two elements rather than one, since a single motion
              value cannot drive a different axis per breakpoint. */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] hidden w-px bg-[var(--border-subtle)] sm:block lg:hidden"
          >
            <motion.div
              className="h-full w-px origin-top bg-gradient-to-b from-brand-600 to-brand-400"
              style={reduce ? { scaleY: 1 } : { scaleY: fill }}
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-x-0 top-[7px] hidden h-px bg-[var(--border-subtle)] lg:block"
          >
            <motion.div
              className="h-px w-full origin-left bg-gradient-to-r from-brand-600 to-brand-400"
              style={reduce ? { scaleX: 1 } : { scaleX: fill }}
            />
          </div>

          <ol ref={trackRef} className="grid gap-[var(--spacing-10)] lg:grid-cols-4 lg:gap-[var(--spacing-8)]">
            {process.map((phase, i) => {
              const lit = i < reached;
              return (
                <li key={phase.step} className="relative sm:pl-[var(--spacing-9)] lg:pt-[var(--spacing-9)] lg:pl-0">
                  {/* Node */}
                  {/* Centred on the track: the track sits at 7px, and the dot is
                      15px, so it needs the same offset plus a half-height pull. */}
                  <span
                    aria-hidden
                    className={`absolute top-[2px] left-0 z-10 size-[15px] rounded-full border-2
                                transition-all duration-[var(--motion-normal)] max-sm:hidden
                                lg:top-[7px] lg:left-0 lg:-translate-y-1/2
                                ${
                                  lit
                                    ? "border-[var(--color-brand-400)] bg-[var(--color-brand-400)]"
                                    : "border-[var(--border-strong)] bg-[var(--surface-base)]"
                                }`}
                  />

                  <Reveal delay={i * 0.07}>
                    <div className="process-step group">
                      <div className="flex items-baseline gap-[var(--spacing-6)]">
                        <span
                          className={`text-2xl leading-none font-bold tracking-[-0.03em] transition-colors
                                      duration-[var(--motion-normal)] ${lit ? "text-accent" : "text-fg-muted"}`}
                        >
                          {phase.step}
                        </span>
                        <span className="tag">{phase.duration}</span>
                      </div>

                      <h3 className="t-h3 mt-[var(--spacing-6)] text-fg-strong">{phase.title}</h3>
                      <p className="t-body mt-[var(--spacing-5)] text-sm">{phase.body}</p>

                      {/* What the client is left holding */}
                      <div
                        className="mt-[var(--spacing-7)] rounded-[var(--radius-xs)] border border-line
                                   bg-raised p-[var(--spacing-6)] transition-colors duration-[var(--motion-normal)]
                                   group-hover:border-line-strong"
                      >
                        <p className="flex items-center gap-[var(--spacing-3)] text-xs tracking-[0.1em] text-accent uppercase">
                          <span aria-hidden>◆</span>
                          You get
                        </p>
                        <p className="mt-[var(--spacing-3)] text-sm font-[550] text-fg-strong">
                          {phase.deliverable}
                        </p>
                        <p className="mt-[var(--spacing-2)] text-sm leading-[1.55] text-fg-muted">
                          {phase.yours}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
