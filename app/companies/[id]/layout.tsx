import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import BuyPoints from "./BuyPoints";
import ShowSidebar from "./ShowSidebar";
import { getPaymentToken } from "../actions";
import getProfile from "@/actions/user";
import { Hourglass } from "lucide-react";

export const revalidate = 0;

const CompanyLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  //

  const { id } = await params;
  const user = await getProfile();
  const payfastReceiverId = process.env.PAYFAST_RECEIVER_ID ?? "";
  const payfastProcessUrl = process.env.PAYFAST_PROCESS_URL ?? "";

  const [company, manager, profile, tiers, token] = await Promise.all([
    prisma.company.findUnique({ where: { id } }),
    prisma.company_manager.findFirst({
      where: {
        AND: {
          company_id: id,
          user_id: user?.id,
        },
      },
    }),
    prisma.profiles.findFirst({ where: { id: user.id } }),
    prisma.point_tiers.findMany({}),
    getPaymentToken(id),
  ]);

  const menuItems: SidebarMenu[] = [
    {
      title: "Details",
      href: `/companies/${id}`,
    },
    {
      title: "Vacancies",
      href: `/companies/${id}/vacancies`,
    },
    {
      title: "Invites",
      href: `/companies/${id}/invites`,
    },
    {
      title: "Manage Youth",
      href: `/companies/${id}/talents`,
    },
    {
      title: "Company Managers",
      href: `/companies/${id}/managers`,
    },
    {
      title: "",
      href: `linebreak`,
    },
    {
      title: "Update Company",
      href: `/companies/${id}/update`,
    },
    {
      title: "Delete Company",
      href: `/companies/${id}/delete`,
      type: "button",
    },
  ];

  if (profile?.role !== "Admin" && !manager) redirect("/dashboard");

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle title="Profile" description="About company" />
        {user.email !== "admin@lvlx.org" && (
          <div className="flex items-center flex-wrap gap-5">
            <BuyPoints
              token={token}
              company={id}
              tiers={tiers}
              payfastReceiverId={payfastReceiverId}
              payfastProcessUrl={payfastProcessUrl}
            />
          </div>
        )}
      </div>
      <Separator className="my-6" />
      {company?.status !== "Approved" && (
        <div
          className={cn(
            "p-4 text-white font-semibold text-sm mb-7 rounded-lg shadow-md transition-all duration-300",
            company?.status === "Pending" ? "bg-gray-900" : "bg-red-500"
          )}
        >
          <div className="flex items-center">
            <span className="mr-2">
              <Hourglass size={15} />
            </span>
            <span>
              Your company status is currently {company?.status}. Please wait
              for admin approval or resubmit your details.
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ShowSidebar id={id} menu={menuItems} />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default CompanyLayout;
