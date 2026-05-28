"use server";

import getProfile from "@/actions/user";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function getPointsTiers() {
  await getProfile();

  const points = await prisma.point_tiers.findMany({});
  return points;
}

export async function addPointTier(cost: string, points: string) {
  await getProfile();

  await prisma.point_tiers.create({
    data: {
      cost,
      points,
    },
  });
  revalidatePath("/settings/tiers");
}

export async function editPointTier(id: string, cost: string, points: string) {
  await getProfile();

  await prisma.point_tiers.update({
    where: { id },
    data: { cost, points },
  });
  revalidatePath("/settings/tiers");
}

export async function deletePointTier(id: string) {
  await getProfile();

  await prisma.point_tiers.delete({
    where: { id },
  });
  revalidatePath("/settings/tiers");
}
