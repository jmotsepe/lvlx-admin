import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import React from "react";
import AddVacancy from "./AddVacancy";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";

export const revalidate = 0;

const CreateVacancyPage = async () => {
  //

  const user = await getProfile();

  const companies = await prisma.company.findMany({
    where: {
      company_manager: {
        some: {
          user_id: user.id,
        },
      },
    },
  });

  return (
    <>
      <PageTitle
        title="Create Vacancy"
        description="Create a new vacancy listing and start receiving job applications"
      />
      <div className="my-8">
        <Separator />
      </div>
      <AddVacancy companies={companies} />
    </>
  );
};

export default CreateVacancyPage;
