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
