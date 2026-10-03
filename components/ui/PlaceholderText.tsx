import { Fragment } from "react";
import { Placeholder } from "./Placeholder";

/** Renders text, wrapping any [BRACKETED TOKEN] in the placeholder treatment. */
export function PlaceholderText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? <Placeholder key={i} label={part} /> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
