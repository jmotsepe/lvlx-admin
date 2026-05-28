import PageTitle from "@/components/main/PageTitle";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";

export const revalidate = 0;

const TalentLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) => {
  const { id } = await params;

  await getProfile();

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { user: true },
  });

  const menuItems: SidebarMenu[] = [
    {
      title: "Personal Details",
      href: `/talents/${id}`,
    },
    {
      title: "Contact Information",
      href: `/talents/${id}/contact`,
    },
    {
      title: "Education",
      href: `/talents/${id}/education`,
    },
    {
      title: "Experiences",
      href: `/talents/${id}/experiences`,
    },
    {
      title: "Reference",
      href: `/talents/${id}/references`,
    },
    {
      title: "Career Objectives",
      href: `/talents/${id}/objectives`,
    },
    {
      title: "Cover Letter",
      href: `/talents/${id}/cover-letter`,
      type: "button",
    },
  ];

  //
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle
          goBack
          title={resume?.name || ""}
          description={resume?.description}
        />
        <a className={buttonVariants()} href={`mailto:${resume?.user?.email}`}>
          Contact Talent
        </a>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="lg:sticky top-20 lg:w-[240px]">
          <Sidebar items={menuItems} />
        </div>
        <div className="flex-1 lg:max-w-6xl">{children}</div>
      </div>
    </>
  );
};

export default TalentLayout;
