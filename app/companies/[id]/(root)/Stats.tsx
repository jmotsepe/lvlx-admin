import Stat from "@/components/custom/stat";
import { prisma } from "@/prisma/prisma";
import { Briefcase, Building2, Clock, Send, Users } from "lucide-react";
import React from "react";

const Stats = async ({ company }: { company: string }) => {
  //
  const [vacancies, applications, interviews, managers] = await Promise.all([
    prisma.vacancy.count({
      where: {
        company_id: company,
      },
    }),
    prisma.vacancy_applications.count({
      where: {
        vacancy: {
          company_id: company,
        },
      },
    }),
    prisma.interview.count({
      where: {
        vacancy: {
          company_id: company,
        },
      },
    }),
    prisma.company_manager.count({
      where: { company_id: { equals: company } },
    }),
  ]);

  const data = [
    {
      title: "Vacancies",
      value: vacancies,
      color: "orange",
      Icon: Briefcase,
    },
    {
      title: "Job Applications",
      value: applications,
      color: "teal",
      Icon: Send,
    },
    {
      title: "Interviews",
      value: interviews,
      color: "cyan",
      Icon: Clock,
    },
    {
      title: "Managers",
      value: managers,
      color: "green",
      Icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((stat, index) => (
        <Stat
          key={index}
          Icon={stat.Icon}
          title={stat.title}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default Stats;
