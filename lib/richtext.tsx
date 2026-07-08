import React from "react";

/*
 * Minimal rich-text rendering for YAML prose fields (bios, project
 * descriptions, news bodies). Supports exactly:
 *
 *   - paragraphs separated by a blank line
 *   - **bold**
 *   - *italics*
 *   - [link text](https://example.com)
 *
 * This is deliberately not a full Markdown engine: it keeps content files
 * predictable and avoids surprises for non-technical editors.
 */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): React.ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, url] = link;
      const external = url.startsWith("http");
      return (
        <a
          key={i}
          href={url}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

/** Split rich text into trimmed paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Render a rich-text field as a sequence of <p> elements. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {paragraphs(text).map((para, i) => (
        <p key={i}>{renderInline(para.replace(/\n/g, " "))}</p>
      ))}
    </>
  );
}

/** Render a single line of rich text without a wrapping <p>. */
export function RichInline({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}
