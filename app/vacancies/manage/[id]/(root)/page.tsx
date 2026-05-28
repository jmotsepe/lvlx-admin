import React from "react";
import Stat from "@/components/custom/stat";
import PageTitle from "@/components/main/PageTitle";
import { Briefcase, Check, CircleDashed, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import UpdateVacancy from "./UpdateVacancy";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";

export const revalidate = 0;

const CompanySingleVacancy = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;

  const user = await getProfile();

  const [vacancy, shortListed, interviewed, companies] = await Promise.all([
    prisma.vacancy.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    }),
    prisma.vacancy_applications.count({
      where: {
        AND: {
          vacancy_id: id,
          status: "ShortListed",
        },
      },
    }),
    prisma.vacancy_applications.count({
      where: {
        AND: {
          vacancy_id: id,
          status: "Interview",
        },
      },
    }),
    prisma.company.findMany({
      where: {
        company_manager: {
          some: {
            user_id: user.id,
          },
        },
      },
    }),
  ]);

  const { _count, ...currentVacancy } = vacancy;

  return (
    <>
      <PageTitle
        title={vacancy.title}
        description="Update and manage published vacancy"
      />
      <div className="my-5">
        <Separator />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <Stat
          Icon={Eye}
          title="Total Views"
          value={vacancy.views}
          color="skyblue"
        />
        <Stat
          Icon={Check}
          title="Applications"
          value={vacancy._count.applications}
          color="green"
        />
        <Stat
          Icon={CircleDashed}
          title="Shortlisted"
          value={shortListed}
          color="orange"
        />
        <Stat
          Icon={Briefcase}
          title="Interviewing"
          value={interviewed}
          color="pink"
        />
      </div>
      <div className="my-5">
        <Separator />
      </div>
      <UpdateVacancy companies={companies} currentVacancy={currentVacancy} />
    </>
  );
};

export default CompanySingleVacancy;
