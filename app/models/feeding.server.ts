import type { Feeding, Plant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Feeding } from "@prisma/client";

export function createFeeding({
  fedDate,
  plantId,
}: Pick<Feeding, "fedDate"> & {
  plantId: Plant["id"];
}) {
  return prisma.feeding.create({
    data: {
      fedDate,
      plantId,
    },
  });
}

export function getFeedingListItems({ plantId }: { plantId: Plant["id"] }) {
  return prisma.feeding.findMany({
    where: { plantId },
    select: { id: true, fedDate: true },
    orderBy: { fedDate: "desc" },
    take: 5,
  });
}
