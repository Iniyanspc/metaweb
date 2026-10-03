import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared OG card: white background, page title in Poppins, the mark bottom-right. */
export async function ogImage(title: string, eyebrow?: string) {
  const [font, mark] = await Promise.all([
    readFile(path.join(process.cwd(), "assets/fonts/Poppins-Medium.ttf")),
    readFile(path.join(process.cwd(), "public/brand/metadatum-mark.svg"), "utf8"),
  ]);
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Poppins",
          color: "#000000",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.02em" }}>metadatum{eyebrow ? `  /  ${eyebrow}` : ""}</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", fontSize: title.length > 60 ? 56 : 68, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 860 }}>
            {title}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- ImageResponse renders to PNG */}
          <img src={markSrc} width={190} height={190} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Poppins", data: font, weight: 500, style: "normal" }] },
  );
}
