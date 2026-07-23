"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Item = { q: string; a: string };

/**
 * Single-open accordion.
 * Keyboard: Enter/Space toggle, ArrowUp/ArrowDown move between triggers, Home/End jump to ends.
 */
export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      triggers.current[next]?.focus();
    }
  };

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                id={`faq-${i}-trigger`}
                aria-expanded={expanded}
                aria-controls={`faq-${i}-panel`}
                onClick={() => setOpen(expanded ? null : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full min-h-14 items-center justify-between gap-[var(--spacing-8)] py-[var(--spacing-7)]
                           text-start text-lg font-[550] text-fg-strong
                           transition-colors duration-[var(--motion-fast)] hover:text-accent cursor-pointer"
              >
                {item.q}
                <span aria-hidden className="relative size-5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-current
                                transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)]
                                ${expanded ? "rotate-0" : "rotate-90"}`}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="panel"
                  id={`faq-${i}-panel`}
                  role="region"
                  aria-labelledby={`faq-${i}-trigger`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="t-body pb-[var(--spacing-8)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
