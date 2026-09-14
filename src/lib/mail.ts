import "server-only";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

/**
 * Email delivery for contact enquiries, via Amazon SES.
 *
 * Environment (server-only — never prefix these with NEXT_PUBLIC_):
 *   AWS_REGION             SES region the sending identity is verified in
 *   AWS_ACCESS_KEY_ID      IAM user limited to ses:SendEmail
 *   AWS_SECRET_ACCESS_KEY
 *   SES_FROM_EMAIL         address on the verified domain, e.g. "Ease Plus <noreply@ease-plus.com>"
 *   SES_TO_EMAIL           recipient; defaults to sales@ease-plus.com
 *
 * Credentials are not read here: the SDK's default provider chain picks them up
 * from the environment, so nothing secret passes through application code.
 */

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

export type DeliveryResult =
  | { delivered: true; messageId?: string }
  | { delivered: false; reason: "unconfigured" | "error" };

const DEFAULT_TO = "sales@ease-plus.com";

let client: SESClient | undefined;

/** One client per process: PM2 keeps the server alive, so connections are reused. */
function getClient(region: string) {
  client ??= new SESClient({
    region,
    maxAttempts: 2,
    requestHandler: { connectionTimeout: 5_000, requestTimeout: 10_000 },
  });
  return client;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Headers must be a single line; strip anything that could fold or break them. */
function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function buildSubject(enquiry: Enquiry) {
  const parts = ["New Website Enquiry", enquiry.interest, enquiry.company].filter(Boolean);
  return singleLine(parts.join(" | "));
}

function buildText(enquiry: Enquiry) {
  return [
    "New website enquiry",
    "",
    `Name:             ${enquiry.name}`,
    `Email:            ${enquiry.email}`,
    `Company:          ${enquiry.company}`,
    `Area of Interest: ${enquiry.interest || "Not specified"}`,
    "",
    "Message:",
    enquiry.message,
    "",
    "Reply to this email to respond directly to the sender.",
  ].join("\n");
}

function buildHtml(enquiry: Enquiry) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b6862;font:14px Arial,sans-serif;vertical-align:top;white-space:nowrap;">${label}</td>
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
        ${row("Area of Interest", enquiry.interest || "Not specified")}
      </table>
      <hr style="border:none;border-top:1px solid #e5e1dd;margin:24px 0;" />
      <p style="margin:0 0 8px;font:600 14px Arial,sans-serif;color:#141413;">Message</p>
      <p style="margin:0;font:14px/1.6 Arial,sans-serif;color:#3f3d38;white-space:pre-wrap;">${escapeHtml(
    enquiry.message,
  )}</p>
      <hr style="border:none;border-top:1px solid #e5e1dd;margin:24px 0;" />
      <p style="margin:0;font:12px Arial,sans-serif;color:#6b6862;">
        Reply to this email to respond directly to the sender.
      </p>
    </div>
  </div>`;
}

export async function sendEnquiry(enquiry: Enquiry): Promise<DeliveryResult> {
  const region = process.env.AWS_REGION;
  const from = process.env.SES_FROM_EMAIL;
  const to = process.env.SES_TO_EMAIL || DEFAULT_TO;

  if (!region || !from) {
    console.error("[contact] SES is not configured: set AWS_REGION and SES_FROM_EMAIL.");
    return { delivered: false, reason: "unconfigured" };
  }

  try {
    const result = await getClient(region).send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        // The visitor is only ever a Reply-To, never the sender.
        ReplyToAddresses: [enquiry.email],
        Message: {
          Subject: { Data: buildSubject(enquiry), Charset: "UTF-8" },
          Body: {
            Text: { Data: buildText(enquiry), Charset: "UTF-8" },
            Html: { Data: buildHtml(enquiry), Charset: "UTF-8" },
          },
        },
      }),
    );

    return { delivered: true, messageId: result.MessageId };
  } catch (error) {
    // Log the error name and message only; the SDK error carries request
    // metadata but never credentials. Details stay server-side.
    const name = error instanceof Error ? error.name : "UnknownError";
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[contact] SES delivery failed: ${name}: ${message}`);
    return { delivered: false, reason: "error" };
  }
}
