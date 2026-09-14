import { NextResponse } from "next/server";

import { sendEnquiry } from "@/lib/mail";

/**
 * Contact endpoint.
 *
 * Validation runs server-side as well as in the client, since the client check
 * is a convenience and not a control. Delivery goes through Amazon SES in
 * `src/lib/mail.ts`. The recipient and sender come from server configuration
 * only; nothing in the request body can change them.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = { name: 120, email: 254, company: 200, interest: 200, messageMin: 20, messageMax: 2000 };

/**
 * Fixed-window rate limit held in memory. Suitable for the single long-lived
 * Node process PM2 runs on Lightsail; counts reset when the process restarts.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();

  // Drop expired windows so the map cannot grow without bound.
  if (hits.size > 1_000) {
    for (const [key, entry] of hits) if (now > entry.resetAt) hits.delete(key);
  }

  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/** Prefers the proxy-set X-Real-IP (e.g. nginx) over the client-controllable X-Forwarded-For. */
function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function fail(status: number, message: string, headers?: HeadersInit) {
  return NextResponse.json({ success: false, message }, { status, headers });
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return fail(429, "Too many messages. Please try again later.", {
      "Retry-After": String(WINDOW_MS / 1000),
    });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "Please complete all required fields.");
  }

  // Honeypot: a real person never fills a field that is hidden from them.
  // Answer exactly as a success would, so bots learn nothing.
  if (str(body.website)) {
    return NextResponse.json({ success: true, message: "Message received." }, { status: 200 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const interest = str(body.interest);
  const message = str(body.message);

  const valid =
    name.length > 0 &&
    name.length <= LIMITS.name &&
    email.length <= LIMITS.email &&
    EMAIL.test(email) &&
    company.length > 0 &&
    company.length <= LIMITS.company &&
    interest.length <= LIMITS.interest &&
    message.length >= LIMITS.messageMin &&
    message.length <= LIMITS.messageMax;

  if (!valid) {
    return fail(400, "Please complete all required fields.");
  }

  const result = await sendEnquiry({ name, email, company, interest, message });

  if (!result.delivered) {
    return fail(502, "Unable to send your message. Please email sales@ease-plus.com directly.");
  }

  return NextResponse.json({ success: true, message: "Message received." }, { status: 200 });
}
