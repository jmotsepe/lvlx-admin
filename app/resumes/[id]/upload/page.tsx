import React from "react";
import UpdateResume from "../UpdateResume";
import ResumeUpload from "./UploadCV";
import PageTitle from "@/components/main/PageTitle";
import Download from "./Download";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import getProfile from "@/actions/user";

export const revalidate = 0;

const ResumeUploadPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  await getProfile();
  const resume = await prisma.resume.findUnique({ where: { id } });

  if (!resume) return redirect("/resumes");

  return (
    <>
      <div>
        <PageTitle title="Upload CV file" description="Update resume's file" />
      </div>
      {resume.url && <Download url={resume.url} />}
      <ResumeUpload id={id} />
    </>
  );
};

export default ResumeUploadPage;
