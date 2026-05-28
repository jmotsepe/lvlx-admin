"use server";

import { sendAcceptanceEmail } from "@/lib/emails/acceptInvite";
import { profilesOptionalDefaults } from "@/prisma/generated/zod";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { getUser } from "./auth";

export async function createProfile(
  data: profilesOptionalDefaults,
  code?: string
) {
  const user = await getUser();

  if (data.role === "Youth") {
    if (!code) throw new Error("Invite code is required");

    const invite = await prisma.invite.findFirstOrThrow({
      where: {
        AND: {
          code: code,
          email: data.email,
        },
      },
      include: { user: true },
    });

    if (!invite) {
      throw new Error("Invite not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.profiles.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          gender: data.gender,
          cell_number: data.cell_number,
          province: data.province,
          role: data.role,
          email: data.email,
          sponsor: invite.company_id,
          id: user.id,
          status: "Pending",
        },
      });

      await tx.invite.delete({
        where: {
          id: invite.id,
        },
      });

      await sendAcceptanceEmail({
        email: invite.user.email,
        name: invite.name,
      });
    });
  } else {
    await prisma.profiles.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        cell_number: data.cell_number,
        province: data.province,
        role: data.role,
        email: data.email,
        status: "Pending",
        id: user.id,
      },
    });
  }

  redirect("/dashboard");
}

export default async function getProfile() {
  const user = await getUser();

  const profile = await prisma.profiles.findUnique({ where: { id: user.id } });
  if (!profile) {
    redirect("/auth/get-started");
  }
  return profile;
}
