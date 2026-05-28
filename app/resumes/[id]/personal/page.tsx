import React from "react";
import PageTitle from "@/components/main/PageTitle";
import PersonalDetailsForm from "./Form";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const PersonalDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;

  const personalData = await prisma.personal_details.findFirst({
    where: { resume_id: id },
  });

  return (
    <div>
      <PageTitle
        title="Personal Details"
        description="Update resume's personal details"
      />
      <PersonalDetailsForm id={id} personalData={personalData} />
    </div>
  );
};

export default PersonalDetailsPage;
