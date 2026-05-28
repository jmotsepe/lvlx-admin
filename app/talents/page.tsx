import PageTitle from "@/components/main/PageTitle";
import React from "react";
import Search from "./Search";
import { prisma } from "@/prisma/prisma";
import { profiles, resume } from "@prisma/client";
import getProfile from "@/actions/user";

export type Talent = resume & {
  user: profiles;
  _count: {
    work_experience: number;
    education_details: number;
    references: number;
  };
};

export const revalidate = 0;

const Talents = async () => {
  await getProfile();
  const talents: Talent[] = await prisma.resume.findMany({
    where: {
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

  return (
    <div>
      <PageTitle
        title="Find youth"
        description="Search and discover talent from resumes available across LVLX"
      />
      <Search initialTalent={talents} />
    </div>
  );
};

export default Talents;
