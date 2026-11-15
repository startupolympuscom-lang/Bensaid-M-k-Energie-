"use client";

import Link from "next/link";
import { MenuToggle } from "@/components/layout/MenuToggle";
import { useMobileMenu, useScrolled } from "@/components/layout/useMobileMenu";
import { DispagazLogo } from "@/components/dispagaz/DispagazLogo";
import { ButtonLink } from "@/components/ui/Button";
import { dispagaz } from "@/config/dispagaz";
import { company } from "@/config/company";
import { dispagazNavigation } from "@/content/dispagaz";
import { isProvided } from "@/lib/company";
import { cn } from "@/lib/cn";

/** Dark product header for /dispagaz — transparent over the hero, solid once scrolled. */
export function DispagazHeader() {
  const scrolled = useScrolled();
  const { open, setOpen, toggleRef, panelRef, panelStyle } = useMobileMenu();
  const hasApp = isProvided(dispagaz.appUrl);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-(--header-h) border-b text-white transition-[background-color,border-color] duration-300",
          open
            ? "border-white/10 bg-night"
            : scrolled
              ? "border-white/10 bg-night/85 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <DispagazLogo onClick={() => setOpen(false)} />

          <nav aria-label="Navigation Dispagaz" className="hidden lg:block">
            <ul className="flex items-center gap-9 xl:gap-11">
              {dispagazNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="py-2 font-heading text-[0.9375rem] font-medium text-white/75 transition-colors duration-200 hover:text-white xl:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-5">
            {hasApp ? (
              <a
                href={dispagaz.appUrl}
                className="hidden font-heading text-[0.9375rem] font-medium text-white/80 transition-colors hover:text-white md:inline"
              >
                Se connecter
              </a>
            ) : null}
            <div className="hidden md:block">
              <ButtonLink href={dispagaz.demoHref} size="sm" variant="accent" arrow>
                Demander une démo
              </ButtonLink>
            </div>
            <MenuToggle
              open={open}
              onToggle={() => setOpen((v) => !v)}
              controls="menu-dispagaz"
              buttonRef={toggleRef}
              className="text-white focus-visible:outline-orange"
            />
          </div>
        </div>
      </header>

      <div
        id="menu-dispagaz"
        ref={panelRef}
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto overscroll-contain bg-night text-white lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
        style={panelStyle}
      >
        <div className="container-page flex min-h-full flex-col pt-6 pb-10">
          <nav aria-label="Navigation Dispagaz mobile">
            <ul className="border-t border-white/10">
              {dispagazNavigation.map((item) => (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex py-5 font-heading text-2xl font-semibold tracking-[-0.02em] focus-visible:outline-orange"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-5 pt-10">
            <ButtonLink
              href={dispagaz.demoHref}
              variant="accent"
              arrow
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Demander une démo
            </ButtonLink>
            {hasApp ? (
              <a
                href={dispagaz.appUrl}
                className="block text-center font-heading font-medium text-white/80"
              >
                Se connecter
              </a>
            ) : null}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block text-center text-[0.9375rem] text-white/60 transition-colors hover:text-white"
            >
              Une solution {company.name}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
