import getProfile from "@/actions/user";
import Stat, { StatProps } from "@/components/custom/stat";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { prisma } from "@/prisma/prisma";
import { faker } from "@faker-js/faker";
import {
  Briefcase,
  Building,
  CreditCard,
  UserCheck,
  UserIcon,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Stats = async () => {
  //

  const user = await getProfile();

  const [companies, cInvite, pInvite] = await Promise.all([
    prisma.company.count({
      where: { company_manager: { some: { user_id: user.id } } },
    }),
    prisma.invite.count({
      where: { company: { company_manager: { some: { user_id: user.id } } } },
    }),
    prisma.invite.count({ where: { user_id: user.id } }),
  ]);

  const data: StatProps[] = [
    {
      title: "Companies",
      color: "blue",
      value: companies,
      Icon: Building,
      link: "/companies",
    },
    {
      title: "Company Invites",
      color: "orange",
      value: cInvite,
      Icon: Users2,
      link: "/invites",
    },
    {
      title: "Personal Invites",
      color: "green",
      value: pInvite,
      Icon: UserCheck,
      link: "/invites",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div
              className={buttonVariants({ size: "icon" })}
              style={{
                backgroundColor: "black",
              }}
            >
              <UserIcon className="text-white" size={18} />
            </div>
            <h1>Invite Users</h1>
          </div>
          <Link className={buttonVariants({ size: "sm" })} href="/invites">
            Invite New Youth
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Stats;
