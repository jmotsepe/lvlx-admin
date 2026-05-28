import React from "react";
import UpdateCompany from "./UpdateCompany";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import PageTitle from "@/components/main/PageTitle";

export const revalidate = 0;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [user, company] = await Promise.all([
    getProfile(),
    prisma.company.findUnique({ where: { id } }),
  ]);

  if (!user) redirect("/dashboard");
  if (!company) redirect("/dashboard");

  return (
    <>
      <PageTitle
        title="Update company"
        description="Update company details and information"
      />
      <br /> <br />
      <div className="max-w-3xl">
        <UpdateCompany currentCompany={company} />
      </div>
    </>
  );
};

export default Page;
