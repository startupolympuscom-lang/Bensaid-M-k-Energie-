"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MenuToggle } from "@/components/layout/MenuToggle";
import { useMobileMenu, useScrolled } from "@/components/layout/useMobileMenu";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import { mainNavigation, quoteCta, type NavItem } from "@/content/navigation";
import { getPhones } from "@/lib/company";
import { cn } from "@/lib/cn";

function isCurrent(item: NavItem, pathname: string) {
  if (!item.match) return false;
  return item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);
}

export function Header() {
  const scrolled = useScrolled();
  const { open, setOpen, toggleRef, panelRef, panelStyle, pathname } = useMobileMenu();
  const phones = getPhones();

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

            <MenuToggle
              open={open}
              onToggle={() => setOpen((v) => !v)}
              controls="menu-mobile"
              buttonRef={toggleRef}
              className="text-ink"
            />
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
        style={panelStyle}
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
