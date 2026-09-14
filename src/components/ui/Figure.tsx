/**
 * Image block used by the home-page preview variants.
 *
 * Every image here is a generated placeholder from /public/placeholders, sized
 * to the aspect ratio the real photograph or diagram should occupy. Swap the
 * `src` for the final asset and nothing about the layout changes.
 */
export function Figure({
  src,
  alt,
  ratio = "16/9",
  caption,
  priority = false,
  className = "",
  rounded = true,
}: {
  src: string;
  alt: string;
  ratio?: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className={`relative w-full overflow-hidden border border-line bg-sunken ${
          rounded ? "rounded-[var(--radius-sm)]" : ""
        }`}
        style={{ aspectRatio: ratio }}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-[var(--spacing-5)] text-sm text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
