/**
 * Lists every unfilled placeholder in the site: missing("…") fields in data/,
 * and bracketed [TOKENS] in data, MDX content and components.
 * Usage: pnpm placeholders        (exits 1 if any remain, for CI)
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["data", "content", "app", "components", "lib"];
const SKIP = new Set(["node_modules", ".next"]);
const EXT = /\.(ts|tsx|mdx|md)$/;
// Bracketed tokens are upper-case labels like [EMAIL] or [METRIC — e.g. …]. The part before
// any " — " or ":" must be capitals only (no commas), which rules out code like [a, b] or [Node].
const TOKEN = /\[([A-Z][^\[\]\n]*)\]/g;
const isLabel = (inner) => /[A-Z]{2}/.test(inner) && /^[A-Z0-9][A-Z0-9 /&'.()-]*$/.test(inner.split(/ — |:/)[0].trim());
const MISSING = /missing\(\s*"([^"]+)"\s*\)/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name) || entry.name.startsWith("%5F")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.test(entry.name)) yield full;
  }
}

const found = [];
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*")) return; // comments
      const seen = new Set();
      for (const m of line.matchAll(MISSING)) seen.add(m[1]);
      for (const m of line.matchAll(TOKEN)) {
        const label = `[${m[1]}]`;
        if (!isLabel(m[1])) continue;
        if ([...seen].some((s) => s.includes(label))) continue;
        seen.add(label);
      }
      for (const label of seen) found.push({ file, line: i + 1, label });
    });
  }
}

const byFile = Map.groupBy ? Map.groupBy(found, (f) => f.file) : found.reduce((m, f) => m.set(f.file, [...(m.get(f.file) ?? []), f]), new Map());
for (const [file, items] of byFile) {
  console.log(`\n${file}`);
  for (const f of items) console.log(`  ${String(f.line).padStart(4)}  ${f.label}`);
}
console.log(`\n${found.length} placeholder${found.length === 1 ? "" : "s"} remaining.`);
process.exit(found.length ? 1 : 0);
