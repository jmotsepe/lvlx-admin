import Stat, { StatProps } from "@/components/custom/stat";
import { prisma } from "@/prisma/prisma";
import {
  Briefcase,
  Building,
  Building2,
  Building2Icon,
  Clock,
  Send,
} from "lucide-react";
import React from "react";

const Stats = async ({ userID }: { userID: string }) => {
  //
  const [resumes, pendingJobs, applications, interviews] = await Promise.all([
    prisma.resume.count({
      where: { user_id: userID },
    }),
    prisma.vacancy_applications.count({
      where: {
        AND: {
          user_id: userID,
          status: "Pending",
        },
      },
    }),
    prisma.vacancy_applications.count({
      where: {
        user_id: userID,
      },
    }),

    prisma.interview.count({
      where: {
        application: {
          user_id: userID,
        },
      },
    }),
  ]);

  const data: StatProps[] = [
    {
      title: "Resumes",
      value: resumes,
      color: "green",
      Icon: Briefcase,
      link: "/resumes",
    },
    {
      title: "Active Applications",
      value: pendingJobs,
      color: "orange",
      Icon: Building,
      link: "/applications",
    },
    {
      title: "All Applications",
      value: applications,
      color: "blue",
      Icon: Building2Icon,
      link: "/applications",
    },
    {
      title: "Upcoming Interviews",
      value: interviews,
      color: "red",
      Icon: Send,
      link: "/interviews",
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
          link={stat.link}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default Stats;
