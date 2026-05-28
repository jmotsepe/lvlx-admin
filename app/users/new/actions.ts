"use server";
import { prisma } from "@/prisma/prisma";
import { createClient } from "@/utils/supabase/server";

export async function sendInvite({
  email,
  company,
}: {
  email: string;
  company: string;
}) {
  await prisma.$transaction(async (tx) => {
    const points = await tx.points.findFirstOrThrow({
      where: { company_id: company },
    });

    const deductions = await tx.payment_settings.findMany({});

    const cost = deductions[0];

    if (points.balance < parseInt(cost.invite_cost)) {
      throw new Error("Not enough points to make this request");
    }

    await tx.points.updateMany({
      where: { company_id: company },
      data: {
        balance: points.balance - parseInt(cost.invite_cost),
      },
    });

    const supabaseServer = await createClient();

    const { data, error } = await supabaseServer.auth.admin.inviteUserByEmail(
      email
    );

    if (error) {
      throw new Error(error.message);
    }

    return data;
  });
}
