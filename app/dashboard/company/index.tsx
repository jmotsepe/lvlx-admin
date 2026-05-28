import React, { Suspense } from "react";
import Stats from "./Stats";
import { prisma } from "@/prisma/prisma";
import VacancyApplications from "./VacancyApplications";
import VacancyInterviews from "./VacancyInterviews";

export type BarGraphsData = {
  title: string;
  _count: {
    interview: number;
    applications: number;
  };
}[];

const CompanyDashboard = async ({ userID }: { userID: string }) => {
  const vacancyApplications = await prisma.vacancy.findMany({
    take: 10,
    select: {
      title: true,
      _count: {
        select: {
          applications: true,
          interview: true,
        },
      },
    },
  });

  return (
    <div>
      <Suspense>
        <Stats userID={userID} />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        <VacancyApplications applicationsCount={vacancyApplications} />
        <VacancyInterviews interviews={vacancyApplications} />
      </div>
    </div>
  );
};

export default CompanyDashboard;
