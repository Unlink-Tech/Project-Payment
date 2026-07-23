/** Continuous ticker of capability keywords. Decorative — hidden from assistive tech. */
export function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];

  return (
    <div
      aria-hidden
      className={`relative flex overflow-hidden border-y border-line py-[var(--spacing-7)]
                  [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] ${className}`}
    >
      <div className="animate-marquee flex shrink-0 items-center gap-[var(--spacing-10)] pr-[var(--spacing-10)]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-[var(--spacing-10)] text-lg
                       whitespace-nowrap text-fg-muted"
          >
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
