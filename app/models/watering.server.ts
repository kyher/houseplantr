import type { Watering, Plant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Watering } from "@prisma/client";

export function createWatering({
  wateredDate,
  plantId,
}: Pick<Watering, "wateredDate"> & {
  plantId: Plant["id"];
}) {
  return prisma.watering.create({
    data: {
      wateredDate,
      plantId,
    },
  });
}

export function getWateringListItems({ plantId }: { plantId: Plant["id"] }) {
  return prisma.watering.findMany({
    where: { plantId },
    select: { id: true, wateredDate: true },
    orderBy: { updatedAt: "desc" },
  });
}
