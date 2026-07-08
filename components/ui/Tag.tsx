import { cn } from "@/lib/utils";

/** Small monospace label chip for topics, statuses, and media types. */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "sky";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "u-label inline-flex items-center rounded-full border px-2.5 py-1",
        tone === "default" && "border-line text-fg-muted",
        tone === "accent" && "border-accent/40 text-accent-soft",
        tone === "sky" && "border-sky/30 text-sky",
        className,
      )}
    >
      {children}
    </span>
  );
}
