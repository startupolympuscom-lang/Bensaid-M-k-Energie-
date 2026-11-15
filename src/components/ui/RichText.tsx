import { Fragment } from "react";

const SUBSCRIPT_DIGITS: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

/**
 * Renders Unicode subscript digits (e.g. "CO₂") as real <sub> elements so
 * they are drawn with the brand typeface instead of a fallback font.
 * Content files can therefore stay plain, readable strings.
 */
export function ChemText({ children }: { children: string }) {
  const parts = children.split(/([₀-₉]+)/u);
  return (
    <>
      {parts.map((part, i) =>
        /^[₀-₉]+$/u.test(part) ? (
          <sub key={i}>{[...part].map((c) => SUBSCRIPT_DIGITS[c] ?? c).join("")}</sub>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
