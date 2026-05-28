import PageTitle from "@/components/main/PageTitle";
import React from "react";
import CoverLetterForm from "./Form";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const CoverLetter = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const coverLetter = await prisma.cover_letter.findFirst({
    where: { resume_id: id },
  });

  return (
    <>
      <PageTitle
        title="Motivational letter"
        description="Write a motivational letter that accompanies your resume."
      />
      <CoverLetterForm id={id} coverLetter={coverLetter} />
    </>
  );
};

export default CoverLetter;
