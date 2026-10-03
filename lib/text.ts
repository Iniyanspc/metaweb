/** Lower-case the first letter for use mid-sentence, leaving acronyms like "HR" alone. */
export function lowerFirst(s: string) {
  return /^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
}
