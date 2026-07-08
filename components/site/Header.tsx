"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { NavItem } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Fixed site header. Receives all labels/links from content/navigation.yaml
 * and content/site.yaml via the root layout — no hardcoded content here.
 */
export function Header({
  shortName,
  name,
  items,
  cta,
}: {
  shortName: string;
  name: string;
  items: NavItem[];
  cta?: NavItem;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-ink/90 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:h-[4.5rem] sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3" title={name}>
          <span className="u-display text-xl tracking-tight text-fg">{shortName}</span>
          <span className="u-label hidden text-fg-faint transition-colors group-hover:text-sky lg:inline">
            {name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "text-sky"
                  : "text-fg-muted hover:bg-ink-overlay hover:text-fg",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {cta ? (
            <Link
              href={cta.href}
              className="ml-3 rounded-full bg-accent px-4.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-soft"
            >
              {cta.label}
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-200",
                open && "top-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-px w-full bg-current transition-transform duration-200",
                open && "top-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base",
                    isActive(item.href) ? "text-sky" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {cta ? (
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-accent px-4 py-2.5 text-center text-base font-medium text-white"
                >
                  {cta.label}
                </Link>
              ) : null}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
