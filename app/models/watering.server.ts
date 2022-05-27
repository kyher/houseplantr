import type { Watering, Plant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Watering } from "@prisma/client";

export function createWatering({
  date,
  plantId,
}: Pick<Watering, "date"> & {
  plantId: Plant["id"];
}) {
  return prisma.watering.create({
    data: {
      date,
      plantId,
    },
  });
}

export function getWateringListItems({ plantId }: { plantId: Plant["id"] }) {
  return prisma.watering.findMany({
    where: { plantId },
    select: { id: true, date: true },
    orderBy: { date: "desc" },
    take: 5,
  });
}
