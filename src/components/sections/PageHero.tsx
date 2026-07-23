import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/ui/Reveal";

/** Compact hero used on interior pages. Shares the hero glow language without the full-height drama. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="relative isolate overflow-hidden pt-[clamp(var(--spacing-11),9vw,var(--spacing-12))]
                 pb-[clamp(var(--spacing-10),6vw,var(--spacing-12))]"
      aria-labelledby="page-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-56 -z-10 h-[36rem] blur-[50px] opacity-80"
        style={{
          background:
            "radial-gradient(38rem 24rem at 22% 40%, var(--glow-1), transparent 62%)," +
            "radial-gradient(34rem 22rem at 72% 55%, var(--glow-2), transparent 62%)",
        }}
      />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site relative z-10">
        <Reveal as="p" className="tag tag-accent" y={10}>
          {eyebrow}
        </Reveal>
        <RevealWords
          as="h1"
          id="page-title"
          text={title}
          className="t-h1 mt-[var(--spacing-8)]"
          delay={0.08}
        />
        {lead && (
          <Reveal delay={0.3}>
            <p className="t-lead mt-[var(--spacing-8)]">{lead}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
