import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/** Consistent eyebrow + heading + lead block used at the top of every section. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  align = "start",
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  align?: "start" | "center";
  children?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={`mb-[var(--spacing-10)] flex flex-col gap-[var(--spacing-6)] ${
        centered ? "items-center text-center" : ""
      }`}
    >
      <Reveal as="p" className="t-eyebrow" y={10}>
        {eyebrow}
      </Reveal>
      <Reveal delay={0.08}>
        <h2 id={id} className={`t-h1 ${centered ? "mx-auto" : ""}`}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className={`t-body ${centered ? "mx-auto" : ""}`}>{lead}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
