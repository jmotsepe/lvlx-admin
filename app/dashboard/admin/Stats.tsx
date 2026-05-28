import Stat, { StatProps } from "@/components/custom/stat";
import { prisma } from "@/prisma/prisma";
import { faker } from "@faker-js/faker";
import {
  Briefcase,
  Building,
  CreditCard,
  UserCheck,
  Users2,
} from "lucide-react";
import React from "react";

const Stats = async () => {
  const [users, companies, vacancies, resumes] = await Promise.all([
    prisma.profiles.count(),
    prisma.company.count(),
    prisma.vacancy.count({ where: { status: "Approved" } }),
    prisma.resume.count(),
  ]);

  const data: StatProps[] = [
    {
      title: "Total Users",
      color: "cyan",
      value: users,
      Icon: Users2,
      link: "/users",
    },
    {
      title: "Total Vacancies",
      color: "yellow",
      value: vacancies,
      Icon: Briefcase,
      link: "/vacancies",
    },
    {
      title: "Companies",
      color: "gray",
      value: companies,
      Icon: Building,
      link: "/companies/admin",
    },
    {
      title: "Total Resumes",
      color: "teal",
      value: resumes,
      Icon: UserCheck,
      link: "/talents",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-10">
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
