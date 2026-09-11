import Link from "next/link";

import { contact, nav, services, site } from "@/lib/site";
import { BrandMark } from "@/components/ui/BrandMark";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-surface">
      {/* Same ambient wash as the hero — the glows are fixed here rather than
          cursor-tracked, so the footer stays a server component. Both layers
          sit behind the content: the blurred one would otherwise paint over it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -bottom-40 -z-10 blur-[40px] opacity-80"
        style={{
          background:
            "radial-gradient(48rem 34rem at 18% 8%, var(--glow-1), transparent 62%)," +
            "radial-gradient(40rem 30rem at 82% 95%, var(--glow-2), transparent 60%)",
        }}
      />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site relative z-10 py-[var(--spacing-12)]">
        <div className="grid gap-[var(--spacing-10)] md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${site.name} home`}
            >
              <BrandMark />
            </Link>
            <p className="t-body mt-[var(--spacing-6)] max-w-[34ch] text-sm">
              {site.description}
            </p>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="footer-heading">
              Navigate
            </h2>
            <ul className="grid gap-[var(--spacing-1)]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className="footer-heading">
              Services
            </h2>
            <ul className="grid gap-[var(--spacing-1)]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="footer-link">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer-heading">Contact</h2>
            <ul className="grid gap-[var(--spacing-1)]">
              {contact.emails.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className="footer-link">
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
            <address className="t-body mt-[var(--spacing-6)] text-sm not-italic">
              {contact.offices[0].address}
            </address>
          </div>
        </div>

        <div
          className="mt-[var(--spacing-11)] flex flex-wrap items-center justify-between gap-[var(--spacing-6)]
                     border-t border-line pt-[var(--spacing-8)]
                     text-sm text-fg-muted"
        >
          <p>© {new Date().getFullYear()} Ease Plus Pte Ltd. All rights reserved.</p>
          <p>Registered in Singapore and Hong Kong.</p>
        </div>
      </div>
    </footer>
  );
}
