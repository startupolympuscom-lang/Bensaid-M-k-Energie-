import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/app/States";
import { OrderDetailScreen } from "@/features/orders/OrderDetailScreen";

export const metadata: Metadata = { title: "Suivi de commande" };

/** The order id is only known at request time (orders live in the browser). */
async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailScreen id={id} />;
}

export default function Page({ params }: PageProps<"/dispagaz/app/commandes/[id]">) {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
