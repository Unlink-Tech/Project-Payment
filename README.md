# Ease Plus — website

Redesign of [projectpayment.me](https://projectpayment.me) as a Next.js app: dark-first,
token-driven, animated, and responsive. All copy is carried over from the existing
`index.php` / `about.php` / `services.php` / `contact.php` pages.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — CSS-first config, tokens declared in `@theme`
- **Motion** (`motion/react`) for interactive animation
- **Sofia Sans** via `next/font` — the brand face `mccom` is not publicly licensed, so the
  next name in the specified stack is used and self-hosted

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the build
```

## Structure

```
src/
  app/
    layout.tsx           root shell: fonts, metadata, theme script, header/footer
    page.tsx             home
    about/page.tsx
    services/page.tsx
    contact/page.tsx
    not-found.tsx        404
    api/contact/route.ts contact endpoint (validate, honeypot, rate limit, send)
    globals.css          design tokens, base, utilities, component classes
  components/
    layout/              Header (sticky, mobile nav), Footer
    sections/            Hero, PageHero, SectionHead, Marquee, Process, WhyUs,
                         Mission, CTA
    ui/                  Button, Card, ServiceCard, Accordion, Counter, Reveal, BrandMark
    ContactForm.tsx      client-side validation + submit states
    ThemeToggle.tsx      also exports the inlined head script
  lib/site.ts            all site content: nav, services, values, offices, FAQs
  lib/mail.ts            contact delivery (Amazon SES)
public/art/              service-card hover artwork (SVG)
```

Content lives in `src/lib/site.ts`. Editing a service, office, or FAQ there updates every
page that references it — including the footer and the contact form's dropdown.

## Design tokens

Two layers, both in `globals.css`:

- **Primitive** — `--color-*`, `--spacing-*`, `--text-*`, `--radius-*`, `--motion-*`
- **Semantic** — `--surface-*`, `--text-*`, `--border-*`, `--action-*`, remapped wholesale
  under `:root[data-theme="light"]`

Semantic tokens are exposed to Tailwind as named colours (`text-fg-muted`, `bg-raised`,
`border-line`) in an `@theme inline` block.

> **Do not write `text-[var(--some-token)]`.** A bare `var()` inside `text-[…]` is ambiguous
> between colour and font-size, and Tailwind v4 resolves it as font-size — which silently
> leaves text the inherited colour. Use the named utilities, or a type hint such as
> `text-[length:clamp(…)]`.

Deviations from the supplied token set, both deliberate:

- `font.size.xs` was `0px`, which cannot render; floored to `12px`.
- The palette had no accent colour, so Mastercard red/amber are added as primitives and
  surfaced only through semantic names (`--text-accent`, `--focus-ring`).

## Motion

Rich but bounded, and every effect is off under `prefers-reduced-motion`:

- Hero gradient tracks the cursor and drifts on scroll (parallax)
- Word-by-word heading entrance (pure CSS, so it plays without JS)
- Scroll reveals with per-item stagger
- Magnetic buttons, spotlight + 3D tilt on cards, animated counters
- Sliding pill on the active nav item, animated accordion height, marquee ticker
- Service cards reveal related artwork plus a one-line promise on hover **or keyboard
  focus**, over a scrim tuned per theme so text contrast survives. Touch devices, which
  have no hover, keep the capability list and show the artwork faintly instead.
- The "why us" ledger has a scroll-linked rail tracking progress through its four rows
- The engagement timeline fills a track as you scroll, lighting each phase node in turn
- The mission dial is a tablist: four domains on a ring with rotating orbits, arrow-key
  navigable, each selection swapping the description panel

**Scroll reveals are CSS-driven, not Motion-driven, on purpose.** Motion serialises its
`initial` state into the SSR markup, which leaves content at `opacity: 0` for any client
where JS does not run. Instead the markup ships visible and the `.js` class — set by the
inlined head script — is what opts an element into being hidden and then revealed.
Same reasoning for `Counter`, which renders its final value and only counts up once an
animation frame actually runs.

## Accessibility

Targets WCAG 2.2 AA. Skip link; visible 3px focus ring on every focusable element;
44px minimum touch targets; labelled landmarks and one `<h1>` per page; accordion with
arrow/Home/End keys; mobile menu closes on Escape and restores focus; form errors use
`aria-invalid` + `aria-describedby` and move focus to the first invalid field.

## Contact form

`POST /api/contact` validates server-side, then hands off to `src/lib/mail.ts`, which
sends through **Amazon SES** (`@aws-sdk/client-ses`). Set these server-only variables
(`.env.local` locally; the PM2 process environment in production):

`AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SES_FROM_EMAIL`, `SES_TO_EMAIL`

Mail goes From `SES_FROM_EMAIL` (an address on the SES-verified domain) To `SES_TO_EMAIL`
(default `sales@ease-plus.com`), with `Reply-To` set to the enquirer. If SES is
unconfigured or fails, the endpoint returns 502 and the form tells the visitor to email
directly; SES error details are logged server-side only.

The endpoint also carries a honeypot field and an in-memory rate limit of 5 submissions
per IP per 10 minutes, which suits a single PM2 process.
