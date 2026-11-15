"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import { mainNavigation, quoteCta, type NavItem } from "@/content/navigation";
import { getPhones } from "@/lib/company";
import { cn } from "@/lib/cn";

function isCurrent(item: NavItem, pathname: string) {
  if (!item.match) return false;
  return item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const phones = getPhones();

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Light translucent background + hairline once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after navigating to another page (incl. browser back/forward).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Close the mobile menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll lock, Escape to close, focus trap while the menu is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const panel = panelRef.current;
    // Next frame: the panel's visibility has switched, so it can take focus.
    const frame = window.requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panel || !toggleRef.current) return;
      const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-(--header-h) border-b transition-[background-color,border-color] duration-300",
          open
            ? "border-line bg-white"
            : scrolled
              ? "border-line/80 bg-white/85 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo onClick={() => setOpen(false)} />

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-9 xl:gap-11">
              {mainNavigation.map((item) => {
                const current = isCurrent(item, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "relative py-2 font-heading text-[0.9375rem] font-medium transition-colors duration-200 xl:text-base",
                        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-orange after:transition-transform after:duration-300 after:ease-soft",
                        current
                          ? "text-ink after:scale-x-100"
                          : "text-ink-muted after:scale-x-0 hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:block">
              <ButtonLink href={quoteCta.href} size="sm" arrow>
                {quoteCta.label}
              </ButtonLink>
            </div>

            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-[22px]">
                <span
                  className={cn(
                    "absolute left-0 block h-[1.75px] w-full rounded-full bg-current transition-transform duration-300 ease-soft",
                    open ? "top-[5px] rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[1.75px] w-full rounded-full bg-current transition-transform duration-300 ease-soft",
                    open ? "top-[5px] -rotate-45" : "top-[10px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & tablet navigation — rendered outside <header> so that the
          header's backdrop-filter never becomes its containing block. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto overscroll-contain bg-white lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
        style={{
          // Visibility flips instantly on open (so focus can move in right
          // away) and only after the fade-out on close.
          transition: open
            ? "opacity 300ms var(--ease-soft), transform 300ms var(--ease-soft), visibility 0s"
            : "opacity 300ms var(--ease-soft), transform 300ms var(--ease-soft), visibility 0s linear 300ms",
        }}
      >
        <div className="container-page flex min-h-full flex-col pt-6 pb-10">
          <nav aria-label="Navigation mobile">
            <ul className="border-t border-line">
              {mainNavigation.map((item) => {
                const current = isCurrent(item, pathname);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 font-heading text-2xl font-semibold tracking-[-0.02em] text-ink"
                    >
                      {item.label}
                      {current ? (
                        <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-orange" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-10">
            <ButtonLink
              href={quoteCta.href}
              arrow
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {quoteCta.label}
            </ButtonLink>
            {phones.length > 0 ? (
              <ul className="mt-6 space-y-2">
                {phones.map((phone) => (
                  <li key={phone.e164}>
                    <a
                      href={phone.href}
                      className="inline-flex items-center gap-3 py-1 text-ink-muted transition-colors hover:text-ink"
                    >
                      <PhoneIcon width={18} height={18} className="text-ink-subtle" />
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
