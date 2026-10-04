/**
 * Email addresses are never rendered as user@domain in page markup, so
 * scrapers can't harvest them. Pages show "user at domain"; EmailLink builds
 * the mailto only when someone clicks.
 */
export function splitEmail(email: string) {
  const at = email.indexOf("@");
  return { user: email.slice(0, at), domain: email.slice(at + 1) };
}

export function maskEmail(email: string) {
  const { user, domain } = splitEmail(email);
  return `${user} at ${domain}`;
}
