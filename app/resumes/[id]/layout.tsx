import PageTitle from "@/components/main/PageTitle";
import Sidebar, { SidebarMenu } from "@/components/main/Sidebar";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";
import DeleteResume from "../DeleteResume";
import { redirect } from "next/navigation";
import UpdateResume from "./UpdateResume";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";
import { validateResume } from "@/actions/resume";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 0;

const SingleResumeLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) => {
  const { id } = await params;

  await getProfile();

  const [resume, validResume] = await Promise.all([
    prisma.resume.findUnique({ where: { id } }),
    validateResume(id),
  ]);

  if (!resume) redirect("/resumes");

  const menuItems: SidebarMenu[] = [
    {
      title: "Summary",
      href: `/resumes/${id}`,
    },
    {
      title: "Personal Details",
      href: `/resumes/${id}/personal`,
    },
    {
      title: "Contact Information",
      href: `/resumes/${id}/contact`,
    },
    {
      title: "Education",
      href: `/resumes/${id}/education`,
    },
    {
      title: "Experiences",
      href: `/resumes/${id}/experiences`,
    },
    {
      title: "Career Objectives",
      href: `/resumes/${id}/objectives`,
    },
    {
      title: "Reference",
      href: `/resumes/${id}/references`,
    },
    {
      title: "Cover Letter",
      href: `/resumes/${id}/cover-letter`,
      type: "button",
    },
  ];

  const fileResumeMenu: SidebarMenu[] = [
    {
      href: `/resumes/${id}/upload`,
      title: "Upload Resume",
    },
    {
      title: <div>Motivational Letter</div>,
      href: `/resumes/${id}/cover-letter`,
      type: "button",
    },
  ];

  //
  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle title={resume?.name} description={resume?.description} />
        <div className="flex items-center gap-4">
          <UpdateResume resume={resume} valid={validResume} />
          <DeleteResume id={id} />
        </div>
      </div>
      <Separator className="my-6" />

      {!resume.available && (
        <Card
          className={cn(
            "bg-emerald-600 text-white mb-6",
            !resume.available && "bg-red-600"
          )}
        >
          <CardHeader>
            <CardTitle className="font-black">Unpublished Resume</CardTitle>
            <CardDescription className="text-white">
              Please fill all the required info on your resume, then you can
              mark it as Available.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="lg:sticky top-20 lg:w-[240px]">
          <Sidebar
            items={resume.type === "Custom" ? menuItems : fileResumeMenu}
          />
        </div>
        <div className="flex-1 lg:max-w-6xl">{children}</div>
      </div>
    </>
  );
};

export default SingleResumeLayout;
