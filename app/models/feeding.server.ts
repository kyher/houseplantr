import type { Feeding, Plant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Feeding } from "@prisma/client";

export function createFeeding({
  date,
  plantId,
}: Pick<Feeding, "date"> & {
  plantId: Plant["id"];
}) {
  return prisma.feeding.create({
    data: {
      date,
      plantId,
    },
  });
}

export function getFeedingListItems({ plantId }: { plantId: Plant["id"] }) {
  return prisma.feeding.findMany({
    where: { plantId },
    select: { id: true, date: true },
    orderBy: { date: "desc" },
    take: 5,
  });
}
