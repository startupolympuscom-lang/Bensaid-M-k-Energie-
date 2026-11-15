import { Suspense } from "react";
import { AppShell } from "@/components/app/AppShell";
import { LoadingState } from "@/components/app/States";

/**
 * AppShell reads the pathname (active navigation). On dynamic routes such as
 * /commandes/[id] it is only known at request time, hence the boundary.
 */
export default function DispagazAppMainLayout({ children }: LayoutProps<"/dispagaz/app">) {
  return (
    <Suspense fallback={<LoadingState label="Ouverture de Dispagaz…" className="min-h-dvh" />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
