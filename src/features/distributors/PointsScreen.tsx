"use client";

import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/app/States";
import { DistributorPicker } from "@/features/distributors/DistributorPicker";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { selectDistributors } from "@/services/distributorService";
import { startOrder } from "@/services/orderService";

export function PointsScreen() {
  const router = useRouter();
  const { db } = useAccount();
  if (!db) return null;
  return (
    <div>
      <PageTitle
        title="Points Dispagaz"
        subtitle="Distributeurs automatiques, accessibles 24h/24 et 7j/7 lorsque indiqué."
      />
      <DistributorPicker
        distributors={selectDistributors(db)}
        chooseLabel="Commander ici"
        onChoose={(id) => {
          startOrder({ fulfillment: "pickup", distributorId: id });
          router.push(appRoutes.order);
        }}
      />
    </div>
  );
}
