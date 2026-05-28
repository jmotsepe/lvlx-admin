import PageTitle from "@/components/main/PageTitle";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { Separator } from "@/components/ui/separator";
import React, { FC } from "react";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const revalidate = 0;

const SettingsLayout: FC<Props> = async ({ children }) => {
  // Get profile
  const profile = await getProfile();
  if (!profile) redirect("/auth/get-started");

  if (profile.role !== "Admin") redirect("/dashboard");

  const menuItems: SidebarMenu[] = [
    {
      title: "Points deductions",
      href: `/settings`,
    },
    {
      title: "Pricing tiers",
      href: `/settings/tiers`,
    },
  ];

  return (
    <>
      <PageTitle title="Settings" description="Manage all LVLX settings" />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Sidebar items={menuItems} className="md:sticky md:top-20" />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default SettingsLayout;
