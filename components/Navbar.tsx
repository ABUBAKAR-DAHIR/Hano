"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Themer from "./Themer";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Shop", href: "/shop" },
  { name: "Contact us", href: "/contact" },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** rAF-throttled scroll flag. */
function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return scrolled;
}

type Box = { left: number; width: number };

function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  /* ---------- sliding hover pill + active underline (desktop) ---------- */
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);
  const [activeBox, setActiveBox] = useState<Box | null>(null);
  const [ready, setReady] = useState(false); // enables transitions after first measure
  const activeIndex = navLinks.findIndex((l) => isActive(pathname, l.href));

  useLayoutEffect(() => {
    const measure = () => {
      const el = linkRefs.current[activeIndex];
      setActiveBox(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(id);
    };
  }, [activeIndex]);

  const showPill = (el: HTMLElement) => setHoverBox({ left: el.offsetLeft, width: el.offsetWidth });

  /* ---------- mobile menu behaviour ---------- */
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const floating = scrolled;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 animate-nav-in motion-reduce:animate-none",
        "transition-[padding] duration-700 motion-reduce:transition-none",
        EASE,
        floating ? "px-3 pt-3 sm:px-4 sm:pt-4" : "px-0 pt-0",
      )}
    >
      <div
        className={clsx(
          "mx-auto border backdrop-blur-xl backdrop-saturate-150",
          "transition-[max-width,border-radius,box-shadow,background-color,border-color] duration-700 motion-reduce:transition-none",
          EASE,
          floating
            ? "max-w-6xl rounded-2xl border-border/70 shadow-[0_12px_32px_-14px_rgba(16,47,59,0.25)] dark:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.7)]"
            : "max-w-full rounded-none border-x-transparent border-t-transparent border-b-border/60 shadow-none",
          open ? "bg-background" : "bg-background/80",
        )}
      >
        <nav
          aria-label="Main"
          className={clsx(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
            "transition-[height] duration-700 motion-reduce:transition-none",
            EASE,
            floating ? "h-16" : "h-20",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Hanowallet home"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={clsx(
                "flex items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm",
                "transition-[width,height,transform] duration-700 group-hover:-rotate-6",
                EASE,
                floating ? "size-9 text-base" : "size-10 text-lg",
              )}
            >
              H
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Hano<span className="text-primary">wallet</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul
            ref={listRef}
            onMouseLeave={() => setHoverBox(null)}
            className="relative hidden items-center gap-1 md:flex"
          >
            {/* hover pill */}
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-lg bg-accent/70",
                ready && "transition-[left,width,opacity] duration-300",
                EASE,
                hoverBox ? "opacity-100" : "opacity-0",
              )}
              style={{ left: hoverBox?.left ?? activeBox?.left ?? 0, width: hoverBox?.width ?? activeBox?.width ?? 0 }}
            />
            {/* active underline */}
            {activeBox && (
              <span
                aria-hidden="true"
                className={clsx(
                  "pointer-events-none absolute -bottom-1.5 h-0.5 rounded-full bg-secondary dark:bg-chart-3",
                  ready && "transition-[left,width] duration-500",
                  EASE,
                )}
                style={{ left: activeBox.left + 14, width: Math.max(0, activeBox.width - 28) }}
              />
            )}

            {navLinks.map((link, i) => {
              const active = i === activeIndex;
              return (
                <li key={link.href}>
                  <Link
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => showPill(e.currentTarget)}
                    onFocus={(e) => showPill(e.currentTarget)}
                    onBlur={() => setHoverBox(null)}
                    className={clsx(
                      "relative z-10 block rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Themer className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-transparent text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

            <Link
              href="/shop"
              className={clsx(
                "group hidden h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm sm:inline-flex",
                "transition-[filter,box-shadow] duration-200 hover:shadow-md hover:brightness-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950",
                "border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
              )}
            >
              Get started
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <span
                className={clsx(
                  "absolute h-0.5 w-[18px] rounded-full bg-current transition-transform duration-300",
                  EASE,
                  open ? "rotate-45" : "-translate-y-[5px]",
                )}
              />
              <span
                className={clsx(
                  "absolute h-0.5 w-[18px] rounded-full bg-current transition-transform duration-300",
                  EASE,
                  open ? "-rotate-45" : "translate-y-[5px]",
                )}
              />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          inert={!open}
          className={clsx(
            "grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none md:hidden",
            EASE,
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border/60 px-4 pb-5 pt-3 sm:px-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = i === activeIndex;
                  return (
                    <li
                      key={link.href}
                      className={clsx(
                        "transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                        EASE,
                        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                      )}
                      style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={clsx(
                          "flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
                        )}
                      >
                        {link.name}
                        {active && <span className="size-2 rounded-full bg-secondary dark:bg-chart-3" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/shop"
                className={clsx(
                  "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm dark:text-neutral-950",
                  "border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500",
                  "transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                  EASE,
                  open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: open ? `${100 + navLinks.length * 50}ms` : "0ms" }}
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;