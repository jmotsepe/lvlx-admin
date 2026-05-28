import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus } from "lucide-react";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";

export const revalidate = 0;

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  //
  const profile = await getProfile();
  if (!profile) redirect("/auth/get-started");

  if (profile.role !== "Admin") redirect("/dashboard");

  const menuItems: SidebarMenu[] = [
    {
      title: "Active Users",
      href: `/users`,
    },
    {
      title: "Pending Users",
      href: `/users/pending`,
    },
    {
      title: "Blocked Users",
      href: `/users/blocked`,
    },
    {
      title: "",
      href: `linebreak`,
    },

    {
      title: "Manage Admins",
      href: `/users/admins`,
      type: "button",
    },
    // {
    //   title: "Add User",
    //   href: `/users/new`,
    //   type: "button",
    // },
  ];

  return (
    <>
      <PageTitle title="Users" description="Manage all LVLX users" />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Sidebar items={menuItems} className="md:sticky md:top-20" />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default UsersLayout;
