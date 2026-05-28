"use client";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";

const ShowSidebar = ({ id, menu }: { id: string; menu: SidebarMenu[] }) => {
  const pathname = usePathname();

  console.log(pathname);
  if (
    pathname === `/companies/${id}/cancel` ||
    pathname === `/companies/${id}/return`
  ) {
    return null;
  }
  return <Sidebar items={menu} />;
};

export default ShowSidebar;
