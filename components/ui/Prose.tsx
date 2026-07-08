import { RichText } from "@/lib/richtext";
import { cn } from "@/lib/utils";

/** Long-form text block rendered from a rich-text content field. */
export function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("u-prose max-w-2xl text-[1.0625rem]", className)}>
      <RichText text={text} />
    </div>
  );
}
