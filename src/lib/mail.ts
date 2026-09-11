import "server-only";

import nodemailer from "nodemailer";

/**
 * Email delivery for contact enquiries.
 *
 * Two transports, chosen by which environment variables are present:
 *   1. Resend  — set RESEND_API_KEY (uses the HTTP API, no SDK needed)
 *   2. SMTP    — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *
 * If neither is configured the enquiry is logged and reported as undelivered,
 * so local development works without credentials but never silently claims to
 * have sent mail it did not send.
 */

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

export type DeliveryResult =
  | { delivered: true; via: "resend" | "smtp" }
  | { delivered: false; reason: "unconfigured" | "error"; detail?: string };

const TO = process.env.CONTACT_TO_EMAIL ?? "sales@ease-plus.com";
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Ease Plus <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildSubject(enquiry: Enquiry) {
  return `New enquiry: ${enquiry.company} (${enquiry.name})`;
}

function buildText(enquiry: Enquiry) {
  return [
    `Name:     ${enquiry.name}`,
    `Email:    ${enquiry.email}`,
    `Company:  ${enquiry.company}`,
    `Interest: ${enquiry.interest || "Not specified"}`,
    "",
    "Message:",
    enquiry.message,
  ].join("\n");
}

function buildHtml(enquiry: Enquiry) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b6862;font:14px Arial,sans-serif;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#141413;font:14px Arial,sans-serif;">${escapeHtml(value)}</td>
    </tr>`;

  return `
  <div style="background:#f3f0ee;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <p style="margin:0 0 24px;font:600 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#b45309;">
        New website enquiry
      </p>
      <table style="border-collapse:collapse;width:100%;">
        ${row("Name", enquiry.name)}
        ${row("Email", enquiry.email)}
        ${row("Company", enquiry.company)}
        ${row("Interest", enquiry.interest || "Not specified")}
      </table>
      <hr style="border:none;border-top:1px solid #e5e1dd;margin:24px 0;" />
      <p style="margin:0 0 8px;font:600 14px Arial,sans-serif;color:#141413;">Message</p>
      <p style="margin:0;font:14px/1.6 Arial,sans-serif;color:#3f3d38;white-space:pre-wrap;">${escapeHtml(
    enquiry.message,
  )}</p>
    </div>
  </div>`;
}

async function sendViaResend(enquiry: Enquiry): Promise<DeliveryResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: enquiry.email,
      subject: buildSubject(enquiry),
      text: buildText(enquiry),
      html: buildHtml(enquiry),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { delivered: false, reason: "error", detail: `Resend ${response.status}: ${detail}` };
  }

  return { delivered: true, via: "resend" };
}

async function sendViaSmtp(enquiry: Enquiry): Promise<DeliveryResult> {
  const port = Number(process.env.SMTP_PORT ?? 587);

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  await transport.sendMail({
    from: FROM,
    to: TO,
    replyTo: enquiry.email,
    subject: buildSubject(enquiry),
    text: buildText(enquiry),
    html: buildHtml(enquiry),
  });

  return { delivered: true, via: "smtp" };
}

export async function sendEnquiry(enquiry: Enquiry): Promise<DeliveryResult> {
  try {
    if (process.env.RESEND_API_KEY) return await sendViaResend(enquiry);
    if (process.env.SMTP_HOST) return await sendViaSmtp(enquiry);

    console.warn(
      "[contact] No mail transport configured (set RESEND_API_KEY or SMTP_HOST). Enquiry logged only:",
      { ...enquiry, message: `${enquiry.message.slice(0, 120)}…` },
    );
    return { delivered: false, reason: "unconfigured" };
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return {
      delivered: false,
      reason: "error",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
