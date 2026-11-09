"use client";

import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";

export type ServiceLink = { id: string; label: string };

/** Sticky section switcher with a sliding pill that follows the section in view. */
export default function ServiceNav({ items }: { items: ServiceLink[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = useState(false);

  // scroll-spy
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  // move the pill
  useLayoutEffect(() => {
    const measure = () => {
      const el = active ? linkRefs.current[active] : null;
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(id);
    };
  }, [active]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="sticky top-24 z-30 flex justify-center px-4">
      <nav
        aria-label="Services"
        className="max-w-full overflow-x-auto rounded-full border border-border/70 bg-background/80 p-1.5 shadow-[0_8px_24px_-14px_rgba(16,47,59,0.3)] backdrop-blur-xl [scrollbar-width:none]"
      >
        <ul className="relative flex">
          {pill && (
            <span
              aria-hidden="true"
              className={clsx(
                "absolute inset-y-0 rounded-full bg-primary",
                ready && "transition-[left,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              )}
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                ref={(el) => {
                  linkRefs.current[id] = el;
                }}
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                aria-current={active === id ? "true" : undefined}
                className={clsx(
                  "relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active === id
                    ? "text-primary-foreground dark:text-neutral-950"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}