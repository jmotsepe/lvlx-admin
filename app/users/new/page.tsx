import PageTitle from "@/components/main/PageTitle";
import React from "react";
import UserInviteForm from "./UserInviteForm";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import { company, points } from "@prisma/client";

export const revalidate = 0;

export type CompanyWithPoints = company & { points: points | null };

const InviteUser = async () => {
  //
  const user = await getProfile();
  if (!user) redirect("/dashboard");

  const companies: CompanyWithPoints[] = await prisma.company.findMany({
    where: {
      company_manager: {
        some: {
          user_id: user.id,
        },
      },
    },
    include: {
      points: true,
    },
  });

  return (
    <>
      <PageTitle
        title="Invite users to LVLX"
        description="Should users choose to accept the invitation, they will be required to
        add a profile to get started."
      />
      <UserInviteForm companies={companies} />
    </>
  );
};

export default InviteUser;
