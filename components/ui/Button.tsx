import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-soft border border-transparent",
  outline:
    "border border-line-bright text-fg hover:border-sky hover:text-sky bg-transparent",
  ghost: "text-fg-muted hover:text-fg bg-transparent border border-transparent",
};

/** Link styled as a button. All navigation on the site is link-based. */
export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const external = href.startsWith("http");
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium",
    "transition-colors duration-200",
    styles[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
