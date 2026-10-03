"use server";

import { contactSchema, fieldErrors, type ContactState } from "@/lib/contact";

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (formData.get("website")) return { status: "success" };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error) };

  try {
    // TODO: wire to [EMAIL SERVICE] (e.g. Resend, Postmark, SES) or a CRM webhook.
    console.info("[contact] new enquiry", { ...parsed.data, message: `${parsed.data.message.length} chars` });
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
