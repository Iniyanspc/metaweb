import { z } from "zod";
import { pages } from "@/data/pages";

const f = pages.contact.form;
const required = (msg = f.errorRequired) => z.string().trim().min(1, msg);

/** Shared by the client form and the server action. */
export const contactSchema = z.object({
  name: required().max(120),
  email: z.string().trim().email(f.errorEmail).max(200),
  company: required().max(160),
  jobTitle: z.string().trim().max(160).optional().or(z.literal("")),
  industry: z.enum(f.industryOptions as [string, ...string[]], { message: f.errorRequired }),
  building: z.enum(f.buildingOptions as [string, ...string[]], { message: f.errorRequired }),
  scope: z.enum(f.scopeOptions as [string, ...string[]], { message: f.errorRequired }),
  message: required().max(5000),
  topic: z.string().max(60).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error" };

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Web3Forms public access key (safe to ship; it only allows submitting to the
 * address registered with it). Set NEXT_PUBLIC_WEB3FORMS_KEY at build time. */
const FORM_ENDPOINT = "https://api.web3forms.com/submit";

/** Sends a validated enquiry from the browser. Returns true when delivered. */
export async function submitContact(data: ContactInput, honeypot: string): Promise<boolean> {
  if (honeypot) return true; // bots fill the hidden field; pretend it worked
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) {
    console.error("Contact form: NEXT_PUBLIC_WEB3FORMS_KEY is not set, so enquiries cannot be sent.");
    return false;
  }
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `Website enquiry: ${data.company} (${data.building})`,
        from_name: data.name,
        replyto: data.email,
        ...data,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success === true;
  } catch {
    return false;
  }
}
