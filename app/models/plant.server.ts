import type { User, Plant } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Plant } from "@prisma/client";

export function getPlant({
  id,
  userId,
}: Pick<Plant, "id"> & {
  userId: User["id"];
}) {
  return prisma.plant.findFirst({
    where: { id, userId },
  });
}

export function getPlantListItems({ userId }: { userId: User["id"] }) {
  return prisma.plant.findMany({
    where: { userId },
    select: { id: true, name: true, location: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPlant({
  name,
  location,
  purchasedAt,
  userId,
}: Pick<Plant, "name" | "location" | "purchasedAt"> & {
  userId: User["id"];
}) {
  return prisma.plant.create({
    data: {
      name,
      location,
      purchasedAt,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePlant({
  id,
  userId,
}: Pick<Plant, "id"> & { userId: User["id"] }) {
  return prisma.plant.deleteMany({
    where: { id, userId },
  });
}
