/**
 * Post-build fixes for hosting the static export on GitHub Pages.
 *
 * Next writes generated preview images as extensionless "opengraph-image"
 * files. GitHub Pages picks the content type from the extension, so they'd be
 * served as application/octet-stream and social sites may ignore them. This
 * renames each to opengraph-image.png and rewrites every reference.
 */
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
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
console.log(`static-fixups: ${renamed} preview images renamed, ${rewritten} files updated.`);
