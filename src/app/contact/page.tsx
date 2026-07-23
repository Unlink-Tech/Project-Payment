import type { Metadata } from "next";

import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ready to optimise your payment infrastructure strategy? Start the conversation with Project Payment.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's work together."
        lead="Ready to optimise your payment infrastructure strategy? Let's start the conversation. We reply within one business day."
      />

      <section className="section-y border-t border-line" aria-labelledby="form-title">
        <div className="container-site grid gap-[var(--spacing-11)] lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <h2 id="form-title" className="t-h2">
                Send us a message
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-[var(--spacing-9)]">
              <ContactForm />
            </Reveal>
          </div>

          <aside className="grid content-start gap-[var(--spacing-8)]">
            <Reveal>
              <Card tilt={false}>
                <h2 className="t-eyebrow">Direct lines</h2>
                <ul className="grid gap-[var(--spacing-6)]">
                  {contact.emails.map((e) => (
                    <li key={e.href} className="grid gap-[var(--spacing-1)]">
                      <span className="text-sm text-fg-muted">{e.note}</span>
                      <a
                        href={e.href}
                        className="text-lg font-[550] text-fg-strong
                                   underline-offset-4 transition-colors duration-[var(--motion-fast)]
                                   hover:text-accent hover:underline"
                      >
                        {e.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>

            {contact.offices.map((office, i) => (
              <Reveal key={office.entity} delay={0.08 + i * 0.07}>
                <div className="border-t-2 border-line pt-[var(--spacing-7)]">
                  <span className="t-eyebrow">{office.region}</span>
                  <h3 className="t-h3 mt-[var(--spacing-3)] text-fg-strong">{office.entity}</h3>
                  <address className="t-body mt-[var(--spacing-3)] text-sm not-italic">
                    {office.address}
                  </address>
                </div>
              </Reveal>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
