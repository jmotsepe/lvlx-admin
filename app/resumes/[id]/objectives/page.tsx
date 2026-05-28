import PageTitle from "@/components/main/PageTitle";
import React from "react";
import ObjectivesForm from "./Form";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const CareerObjectives = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const objectives = await prisma.career_objectives.findFirst({
    where: { resume_id: id },
  });

  return (
    <>
      <PageTitle
        title="Career Objectives"
        description="Explain what you'd like to achieve in your career"
      />
      <ObjectivesForm id={id} objectives={objectives} />
    </>
  );
};

export default CareerObjectives;
