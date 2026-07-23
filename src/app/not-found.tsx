import { Button } from "@/components/ui/Button";
import { nav } from "@/lib/site";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="nf-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[30rem] blur-[50px] opacity-70"
        style={{
          background:
            "radial-gradient(32rem 20rem at 30% 50%, var(--glow-1), transparent 62%)," +
            "radial-gradient(28rem 18rem at 70% 50%, var(--glow-2), transparent 62%)",
        }}
      />
      <div className="container-site relative grid min-h-[70vh] content-center gap-[var(--spacing-8)] py-[var(--spacing-12)]">
        <p className="t-eyebrow">404</p>
        <h1 id="nf-title" className="t-h1">
          That page has moved on.
        </h1>
        <p className="t-lead">
          The link is broken or the page no longer exists. Here is the rest of the site.
        </p>

        <ul className="flex flex-wrap gap-[var(--spacing-5)]">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="tag transition-colors duration-[var(--motion-fast)]
                           hover:border-line-strong hover:text-fg-strong"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-[var(--spacing-6)] flex flex-wrap gap-[var(--spacing-6)]">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
