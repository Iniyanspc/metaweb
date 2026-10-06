/**
 * Post-build fixes for hosting the static export on GitHub Pages.
 *
 * Next writes generated preview images as extensionless "opengraph-image"
 * files. GitHub Pages picks the content type from the extension, so they'd be
 * served as application/octet-stream and social sites may ignore them. This
 * renames each to opengraph-image.png and rewrites every reference.
 *
 * Unpublished sections (lib/publish.ts) call notFound(), which static export
 * still writes out as a page. Those routes are deleted here so GitHub Pages
 * answers them with a real 404 (out/404.html).
 */
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "out";
let renamed = 0;
let rewritten = 0;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// 1. Remove routes that only render the not-found page. Matched on the page
//    title, which only the not-found page sets (its component code is embedded
//    in every page's data, so body markers would match everything).
const NOT_FOUND_TITLE = "<title>Page not found — metadatum</title>";
const hiddenDirs = [];
for await (const file of walk(OUT)) {
  if (path.basename(file) !== "index.html") continue;
  const dir = path.dirname(file);
  if (dir === OUT || dir.endsWith(`${path.sep}_not-found`) || dir.endsWith(`${path.sep}404`)) continue;
  if ((await readFile(file, "utf8")).includes(NOT_FOUND_TITLE)) hiddenDirs.push(dir);
}
for (const dir of hiddenDirs) await rm(dir, { recursive: true, force: true });
const removed = hiddenDirs.length;

const files = [];
for await (const file of walk(OUT)) files.push(file);

for (const file of files) {
  if (path.basename(file) === "opengraph-image") {
    await rename(file, `${file}.png`);
    renamed++;
  }
}
for (const file of files) {
  if (!/\.(html|txt|xml)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  const next = text.replace(/\/opengraph-image(?=[?"'\s<])/g, "/opengraph-image.png");
  if (next !== text) {
    await writeFile(file, next);
    rewritten++;
  }
}
console.log(`static-fixups: ${removed} unpublished routes removed, ${renamed} preview images renamed, ${rewritten} files updated.`);
