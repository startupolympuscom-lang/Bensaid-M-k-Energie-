"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AppLogo, DemoBadge } from "@/components/app/AppLogo";
import { FlameIcon, HomeIcon, ListIcon, UserIcon, WalletIcon } from "@/components/app/Icons";
import { NotificationsMenu } from "@/components/app/NotificationsMenu";
import { LoadingState } from "@/components/app/States";
import { formatMAD } from "@/lib/dispagaz/format";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { cn } from "@/lib/cn";

const desktopNav = [
  { label: "Accueil", href: appRoutes.home },
  { label: "Commander du GPL", href: appRoutes.order },
  { label: "Mes commandes", href: appRoutes.orders },
  { label: "Portefeuille", href: appRoutes.wallet },
  { label: "Points Dispagaz", href: appRoutes.points },
  { label: "Mes adresses", href: appRoutes.addresses },
  { label: "Profil", href: appRoutes.profile },
];

const mobileNav = [
  { label: "Accueil", href: appRoutes.home, Icon: HomeIcon },
  { label: "Commander", href: appRoutes.order, Icon: FlameIcon },
  { label: "Commandes", href: appRoutes.orders, Icon: ListIcon },
  { label: "Portefeuille", href: appRoutes.wallet, Icon: WalletIcon },
  { label: "Profil", href: appRoutes.profile, Icon: UserIcon },
];

function isActive(pathname: string, href: string) {
  return href === appRoutes.home ? pathname === href : pathname.startsWith(href);
}

/** Guards the app (sign-in + onboarding) and renders navigation. */
export function AppShell({ children }: { children: ReactNode }) {
  const { ready, session, account } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const needsLogin = ready && (!session || !account);
  const needsOnboarding = ready && !!account && !account.profile;

  useEffect(() => {
    if (needsLogin) router.replace(appRoutes.login);
    else if (needsOnboarding) router.replace(appRoutes.onboarding);
  }, [needsLogin, needsOnboarding, router]);

  if (!ready || needsLogin || needsOnboarding || !account?.profile) {
    return <LoadingState label="Ouverture de Dispagaz…" className="min-h-dvh" />;
  }

  const { profile, wallet } = account;
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="dz-app flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col bg-dz-ink px-5 py-7 text-white lg:flex">
        <div className="flex items-center gap-3 px-3">
          <AppLogo tone="onDark" />
        </div>
        <nav aria-label="Navigation Dispagaz" className="mt-10 flex-1">
          <ul className="space-y-1">
            {desktopNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-11 items-center rounded-[12px] px-3 text-[0.9375rem] font-medium transition-colors",
                      active
                        ? "bg-white/8 text-white"
                        : "text-white/65 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full bg-dz-orange"
                      />
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3 rounded-[14px] bg-white/6 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dz-orange text-sm font-bold text-dz-ink">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {profile.firstName} {profile.lastName}
            </span>
            <span className="block truncate text-xs text-white/55">{profile.email}</span>
          </span>
        </div>
        <p className="mt-4 px-3 text-xs text-white/45">Version de démonstration</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-dz-line/70 bg-white/90 px-4 backdrop-blur-xl sm:px-8 lg:justify-end lg:px-12">
          <div className="flex items-center gap-2.5 lg:hidden">
            <AppLogo className="h-7" />
            <DemoBadge />
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href={appRoutes.wallet}
              className="hidden h-10 items-center rounded-full bg-dz-surface px-4 text-sm font-medium hover:bg-dz-gray sm:inline-flex"
            >
              <span className="sr-only">Solde du portefeuille : </span>
              {formatMAD(wallet.balance)}
            </Link>
            <span className="hidden lg:inline-flex">
              <DemoBadge />
            </span>
            <NotificationsMenu />
          </div>
        </header>

        <main
          id="contenu"
          tabIndex={-1}
          className="dz-page-pad flex-1 px-5 pt-7 outline-none sm:px-8 lg:px-12 lg:pt-12"
        >
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Navigation Dispagaz mobile"
        className="dz-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-dz-line bg-white/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {mobileNav.map(({ label, href, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium",
                    active ? "text-dz-ink" : "text-dz-subtle",
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 h-[3px] w-8 rounded-b-full bg-dz-orange"
                    />
                  ) : null}
                  <Icon width={22} height={22} strokeWidth={active ? 2 : 1.7} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
