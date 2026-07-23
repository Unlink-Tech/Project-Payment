"use client";

import { useState } from "react";

import { values } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Values ladder.
 *
 * Five equal cards read as filler, so each value is a rung that opens on hover,
 * focus, or tap. Everything sits on a three-column grid — index, label,
 * indicator — so the body copy lines up exactly under the label rather than
 * floating at an arbitrary indent.
 */
export function Values() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-y border-t border-line" aria-labelledby="values-title">
      <div className="container-site grid gap-[var(--spacing-10)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-[var(--spacing-11)]">
        {/* Sticky heading, so the list has something to sit against */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal as="p" className="t-eyebrow">
            Core values
          </Reveal>
          <Reveal delay={0.08}>
            {/* Sized for this narrower column: at full t-h1 the first line
                orphans a single word. */}
            <h2
              id="values-title"
              className="mt-[var(--spacing-6)] max-w-[16ch] text-[length:clamp(1.875rem,3.4vw,2.75rem)]
                         leading-[1.08] font-bold tracking-[-0.03em] text-fg-strong"
            >
              Five commitments we are held to
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-body mt-[var(--spacing-7)]">
              Not aspirations. These are the standards a client can hold us against during an
              engagement, and the ones we expect to be judged on when it ends.
            </p>
          </Reveal>
        </div>

        {/* Ladder */}
        <ul className="grid border-t border-line">
          {values.map((value, i) => {
            const active = open === i;
            return (
              <li key={value.title}>
                <Reveal delay={i * 0.05}>
                  <div
                    className={`value-rung group relative border-b border-line ${active ? "is-open" : ""}`}
                    onMouseEnter={() => setOpen(i)}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={active}
                        aria-controls={`value-${i}-body`}
                        onClick={() => setOpen(active ? null : i)}
                        onFocus={() => setOpen(i)}
                        className="grid w-full cursor-pointer grid-cols-[3rem_1fr_1.25rem] items-center
                                   gap-x-[var(--spacing-8)] py-[var(--spacing-8)] text-start"
                      >
                        <span
                          className={`text-2xl leading-none font-bold tracking-[-0.03em] tabular-nums
                                      transition-colors duration-[var(--motion-normal)]
                                      ${active ? "text-accent" : "text-fg-muted"}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="text-xl leading-tight font-[550] text-fg-strong">
                          {value.title}
                        </span>

                        {/* Plus that becomes a minus — a clearer expand affordance than an arrow */}
                        <span aria-hidden className="relative block size-4 justify-self-end text-accent">
                          <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-current" />
                          <span
                            className={`absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-current
                                        transition-transform duration-[var(--motion-normal)]
                                        ease-[var(--ease-standard)] ${active ? "rotate-0" : "rotate-90"}`}
                          />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={`value-${i}-body`}
                      className={`grid transition-[grid-template-rows] duration-[var(--motion-normal)]
                                  ease-[var(--ease-out-soft)] ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        {/* Same column offset as the label above: 3rem index + gap */}
                        <p className="max-w-[52ch] pb-[var(--spacing-8)] pl-[calc(3rem+var(--spacing-8))] text-md leading-[1.6] text-fg-muted">
                          {value.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
