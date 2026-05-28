"use server";
import { prisma } from "@/prisma/prisma";
import { TalentForm } from "./Search";
import { Talent } from "./page";

export async function getTalents(data: TalentForm) {
  const { province, search } = data;

  const talents: Talent[] = await prisma.resume.findMany({
    where: {
      user: {
        province: {
          equals: province || undefined,
        },
      },
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          career_objectives: {
            objectives: {
              contains: search,
              mode: "insensitive",
            },
          },
          cover_letter: {
            letter: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
      available: true,
    },
    include: {
      user: true,
      _count: {
        select: {
          work_experience: true,
          education_details: true,
          references: true,
        },
      },
    },
  });

  return talents;
}
