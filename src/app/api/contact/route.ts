import { NextResponse } from "next/server";

import { sendEnquiry, type Enquiry } from "@/lib/mail";

/**
 * Contact endpoint.
 *
 * Validation runs server-side as well as in the client, since the client check
 * is a convenience and not a control. Delivery transport is selected in
 * `src/lib/mail.ts` from the environment.
 */

type Payload = Partial<Enquiry> & { website?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Naive fixed-window rate limit. Per-instance only — front with a real limiter if traffic warrants. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  // Honeypot: a real person never fills a field that is hidden from them.
  if (body.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const message = (body.message ?? "").trim();
  const interest = (body.interest ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name || name.length > 120) errors.name = "A name of 120 characters or fewer is required.";
  if (!EMAIL.test(email)) errors.email = "A valid email address is required.";
  if (!company || company.length > 200) errors.company = "A company name is required.";
  if (message.length < 20 || message.length > 2000)
    errors.message = "A message between 20 and 2,000 characters is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const result = await sendEnquiry({ name, email, company, interest, message });

  // A transport error is a real failure — tell the client so it can offer the
  // direct email address instead of pretending the message went through.
  if (!result.delivered && result.reason === "error") {
    return NextResponse.json(
      { error: "The message could not be delivered. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: result.delivered }, { status: 200 });
}
