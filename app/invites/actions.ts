"use server";

import { generateOTP } from "@/lib/utils";
import { inviteOptionalDefaults } from "@/prisma/generated/zod";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendRemovalEmail } from "@/lib/emails/removeInvite";
import { sendInviteEmail } from "@/lib/emails/sendInvite";

export async function sendInvite(data: inviteOptionalDefaults) {
  const opt = generateOTP(6);

  await prisma.$transaction(async (tx) => {
    //

    const [existingInvite, user] = await Promise.all([
      tx.invite.findFirst({
        where: { email: data.email },
      }),
      getProfile(),
    ]);

    if (!user) redirect("/auth/get-started");

    if (existingInvite) {
      throw new Error("Invite already sent");
    }

    const company = await tx.company.findUnique({
      where: { id: data.company_id },
    });

    if (!company) throw new Error("Company not found");

    const [points, deductions] = await Promise.all([
      tx.points.findFirstOrThrow({
        where: { company_id: company.id },
      }),

      tx.payment_settings.findMany({}),
    ]);

    const cost = deductions[0];

    if (points.balance < parseInt(cost.invite_cost)) {
      throw new Error("Not enough points to make this request");
    }

    await tx.points.updateMany({
      where: { company_id: company.id },
      data: {
        balance: points.balance - parseInt(cost.invite_cost),
      },
    });

    await tx.invite.create({
      data: {
        email: data.email,
        name: data.name,
        message: data.message,
        code: opt,
        user_id: user.id,
        company_id: data.company_id,
      },
    });

    await sendInviteEmail({
      name: data.name,
      user: `${user.first_name} ${user.last_name}`,
      code: opt,
      email: data.email,
      message: data.message,
      company: company.name,
    });
  });

  revalidatePath("/invites");
}

export async function removeInvite(id: string) {
  const [invite, user] = await Promise.all([
    prisma.invite.findUnique({
      where: { id: id },
    }),
    getProfile(),
  ]);

  if (!user) redirect("/auth/get-started");

  if (!invite) {
    throw new Error("Invite not found");
  }

  await prisma.$transaction(async (tx) => {
    //

    await tx.invite.delete({
      where: { id },
    });

    await sendRemovalEmail({
      name: invite.name,
      user: `${user.first_name} ${user.last_name}}`,
      email: invite.email,
    });
  });

  revalidatePath("/invites");
}
