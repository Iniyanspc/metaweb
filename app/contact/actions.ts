"use server";

import { site } from "@/data/site";
import { contactSchema, fieldErrors, type ContactState } from "@/lib/contact";

/** Where enquiries are delivered. Server-only; never sent to the browser. */
const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? site.formRecipient;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (formData.get("website")) return { status: "success" };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error) };

  try {
    // TODO: send via an email service (e.g. Resend, Postmark, SES) to CONTACT_TO.
    console.info("[contact] new enquiry for", CONTACT_TO.replace("@", " at "), { ...parsed.data, message: `${parsed.data.message.length} chars` });
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
