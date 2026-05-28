import Stat, { StatProps } from "@/components/custom/stat";
import { prisma } from "@/prisma/prisma";
import { Briefcase, Building2, Clock, Send, User2Icon } from "lucide-react";
import React from "react";

const Stats = async ({ userID }: { userID: string }) => {
  //
  const [companies, invites, applications, interviews] = await Promise.all([
    prisma.company.count({
      where: { company_manager: { some: { user_id: userID } } },
    }),
    prisma.invite.count({
      where: {
        user_id: userID,
      },
    }),
    prisma.vacancy_applications.count({
      where: {
        vacancy: {
          company: {
            company_manager: {
              some: {
                user_id: userID,
              },
            },
          },
        },
      },
    }),
    prisma.interview.count({
      where: {
        vacancy: {
          company: {
            company_manager: {
              some: {
                user_id: userID,
              },
            },
          },
        },
      },
    }),
  ]);

  const data: StatProps[] = [
    {
      title: "Companies",
      value: companies,
      color: "green",
      Icon: Building2,
      link: "/companies",
    },
    {
      title: "Invites",
      value: invites,
      color: "orange",
      Icon: User2Icon,
      link: "/invites",
    },
    {
      title: "Job Applications",
      value: applications,
      color: "darkpink",
      Icon: Send,
      link: "/applications/company",
    },
    {
      title: "Interviews",
      value: interviews,
      color: "blue",
      Icon: Clock,
      link: "/interviews/company",
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
          link={stat.link}
        />
      ))}
    </div>
  );
};

export default Stats;
