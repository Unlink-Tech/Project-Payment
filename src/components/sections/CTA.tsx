import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/lib/site";

export function CTA({
  title = "Let's work together",
  lead = "Ready to optimise your payment infrastructure strategy? Let's start the conversation.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="section-y" aria-labelledby="cta-title">
      <div className="container-site">
        <Reveal>
          <div
            className="relative isolate overflow-hidden rounded-[var(--radius-md)] border border-line
                       bg-raised px-[var(--spacing-8)] py-[var(--spacing-12)] text-center
                       sm:px-[var(--spacing-10)]"
          >
            {/* Drifting aurora wash, plus a faint grid for depth. Both decorative. */}
            <div aria-hidden className="aurora pointer-events-none absolute inset-0 -z-10" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--grid-line) 1px, transparent 1px)," +
                  "linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 100%)",
              }}
            />
            <p className="t-eyebrow">Get in touch</p>
            <h2 id="cta-title" className="t-h1 mx-auto mt-[var(--spacing-6)]">
              {title}
            </h2>
            <p className="t-body mx-auto mt-[var(--spacing-6)] max-w-[52ch]">{lead}</p>

            <div className="mt-[var(--spacing-10)] flex flex-wrap items-center justify-center gap-[var(--spacing-6)]">
              <Button href="/contact" size="lg">
                Start a conversation
              </Button>
              <Button href={contact.emails[0].href} size="lg" variant="secondary">
                {contact.emails[0].label}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
