import getProfile from "@/actions/user";
import PageTitle from "@/components/main/PageTitle";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";
import ApproveVacancy from "../../admin/ApproveVacancy";
import RejectVacancy from "../../admin/RejectVacancy";
import DeleteVacancy from "../DeleteVacancy";

type Props = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export const revalidate = 0;

const SingleVacancyLayout: FC<Props> = async ({ children, params }) => {
  const { id } = await params;

  const menuItems: SidebarMenu[] = [
    {
      title: "Update",
      href: `/vacancies/manage/${id}`,
    },
    {
      title: "Applications",
      href: `/vacancies/manage/${id}/applications`,
    },
    {
      title: "Shortlisting",
      href: `/vacancies/manage/${id}/shortlist`,
    },
    {
      title: "Interviews",
      href: `/vacancies/manage/${id}/interviews`,
    },
    {
      title: "",
      href: `linebreak`,
    },
    {
      title: "Hired Candidates",
      href: `/vacancies/manage/${id}/hired`,
      type: "button",
    },
  ];

  const [vacancy, user] = await Promise.all([
    prisma.vacancy.findUnique({ where: { id } }),
    getProfile(),
  ]);

  if (!vacancy) redirect("/dashboard");
  if (!user) redirect("/auth/get-started");

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle
          title="Vacancy Details"
          description="Manage your vacancy details"
        />
        {user.role === "Admin" && vacancy.status === "Pending" && (
          <div className="flex items-center gap-4 flex-wrap">
            <ApproveVacancy id={id} />
            <RejectVacancy id={id} />
          </div>
        )}

        {user.role === "Employer" && <DeleteVacancy id={id} />}
      </div>
      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Sidebar items={menuItems} className="md:sticky md:top-20" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default SingleVacancyLayout;
