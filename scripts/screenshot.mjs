/**
 * Full-page screenshots at 1440 and 390 wide.
 * Usage: node scripts/screenshot.mjs [baseUrl] [route ...]
 * Output: .screenshots/<route>-<width>.png
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const [base = "http://localhost:3000", ...args] = process.argv.slice(2);
const routes = args.length ? args : ["/"];
const widths = [1440, 390];
const out = ".screenshots";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.waitForTimeout(2500); // let load animations settle
    const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/[/%]/g, "_");
    await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true });
    console.log(`${out}/${name}-${width}.png`);
  }
  await page.close();
}
await browser.close();
