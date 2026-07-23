"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";

import { disciplines } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const RADIUS = 37; // percent of the dial box

function position(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + RADIUS * Math.cos(rad), y: 50 + RADIUS * Math.sin(rad) };
}

/**
 * Mission section.
 *
 * The statement names four domains; rather than listing them in a sentence and
 * leaving it there, they are placed on a dial the reader can interrogate.
 * Implemented as a tablist, so arrow keys move between domains and the
 * description is announced as the selected panel.
 */
export function Mission({
  eyebrow = "Our mission",
  lead = "Delivered through independent, forward-looking advisory across four domains that most businesses buy separately, and that only work when they agree with each other.",
  id = "mission-title",
}: {
  eyebrow?: string;
  lead?: string;
  id?: string;
} = {}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = disciplines.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  const current = disciplines[active];

  return (
    <section className="section-y border-t border-line" aria-labelledby={id}>
      <div className="container-site grid items-center gap-[var(--spacing-11)] lg:grid-cols-[1fr_0.9fr]">
        {/* Statement */}
        <div>
          <Reveal as="p" className="t-eyebrow">
            {eyebrow}
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              id={id}
              className="mt-[var(--spacing-8)] max-w-[20ch] text-[length:clamp(1.75rem,4.4vw,var(--text-2xl))]
                         leading-[1.2] font-bold tracking-[-0.03em] text-fg-strong"
            >
              To empower e-commerce businesses to operate with{" "}
              <span className="mission-underline">clarity</span>,{" "}
              <span className="mission-underline">confidence</span>, and{" "}
              <span className="mission-underline">long-term resilience</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-body mt-[var(--spacing-8)]">{lead}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-[var(--spacing-7)] text-sm text-fg-muted">
              <span aria-hidden>↓ </span>
              Choose a domain to see what we actually look at.
            </p>
          </Reveal>
        </div>

        {/* Dial */}
        <Reveal delay={0.12}>
          <div className="mx-auto w-full max-w-[440px]">
            {/* Below sm the dial collapses to a chip row: the pills would
                otherwise overhang a 320px viewport. */}
            <div className="relative w-full sm:aspect-square">
              {/* Decorative orbits */}
              <div
                aria-hidden
                className={`absolute inset-[6%] hidden rounded-full border border-dashed border-line sm:block ${
                  reduce ? "" : "animate-orbit"
                }`}
              />
              <div
                aria-hidden
                className={`absolute inset-[22%] hidden rounded-full border border-line sm:block ${
                  reduce ? "" : "animate-orbit-reverse"
                }`}
              />

              {/* Spokes — the active one lights up */}
              <svg
                aria-hidden
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 hidden size-full sm:block"
              >
                {disciplines.map((d, i) => {
                  const p = position(d.angle);
                  return (
                    <line
                      key={d.key}
                      x1="50"
                      y1="50"
                      x2={p.x}
                      y2={p.y}
                      stroke={i === active ? "var(--color-brand-400)" : "var(--border-subtle)"}
                      strokeWidth={i === active ? 0.6 : 0.4}
                      className="transition-[stroke] duration-[var(--motion-normal)]"
                    />
                  );
                })}
              </svg>

              {/* Core */}
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 hidden size-[30%] -translate-x-1/2 -translate-y-1/2
                           place-items-center rounded-full border border-line bg-raised text-center sm:grid"
              >
                <div
                  className="absolute inset-0 rounded-full opacity-70 blur-md"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, var(--glow-1), transparent 60%)," +
                      "radial-gradient(circle at 65% 65%, var(--glow-2), transparent 60%)",
                  }}
                />
                <span className="relative px-2 text-xs tracking-[0.12em] text-fg-muted uppercase">
                  Clarity
                </span>
              </div>

              {/* Domain tabs */}
              <div
                role="tablist"
                aria-label="Advisory domains"
                aria-orientation="horizontal"
                className="flex flex-wrap justify-center gap-[var(--spacing-3)] sm:absolute sm:inset-0 sm:gap-0"
              >
                {disciplines.map((d, i) => {
                  const p = position(d.angle);
                  const selected = i === active;
                  return (
                    <button
                      key={d.key}
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      role="tab"
                      id={`domain-${d.key}-tab`}
                      aria-selected={selected}
                      aria-controls="domain-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(i)}
                      onKeyDown={onKeyDown}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border
                                  px-[var(--spacing-6)] py-[var(--spacing-3)] text-sm whitespace-nowrap
                                  transition-all duration-[var(--motion-normal)]
                                  sm:absolute sm:min-h-0 sm:-translate-x-1/2 sm:-translate-y-1/2
                                  ${
                                    selected
                                      ? "border-brand-400 bg-raised font-[550] text-fg-strong shadow-lg scale-105"
                                      : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg-strong"
                                  }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel */}
            <div
              role="tabpanel"
              id="domain-panel"
              aria-labelledby={`domain-${current.key}-tab`}
              className="mt-[var(--spacing-8)] min-h-[152px] rounded-[var(--radius-sm)] border border-line
                         bg-raised p-[var(--spacing-8)]"
            >
              {/* Keyed so React remounts and the CSS entrance replays. Deliberately
                  not an exit/enter pair: content must never wait on an animation
                  to finish before it is readable. */}
              <div key={current.key} className="panel-in">
                <h3 className="t-h3 text-fg-strong">{current.label}</h3>
                <p className="mt-[var(--spacing-5)] text-sm leading-[1.6] text-fg-muted">
                  {current.body}
                </p>
                <p className="mt-[var(--spacing-6)] inline-flex items-center gap-[var(--spacing-3)] text-sm text-accent">
                  <span aria-hidden>→</span>
                  {current.proof}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
