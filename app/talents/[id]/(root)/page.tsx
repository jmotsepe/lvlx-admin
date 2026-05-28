import getProfile from "@/actions/user";
import NoData from "@/app/vacancies/manage/[id]/applications/[appID]/NoData";
import PageTitle from "@/components/main/PageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 0;

const PersonalDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  await getProfile();
  const details = await prisma.personal_details.findUnique({
    where: { resume_id: id },
  });

  if (!details) return <NoData />;

  return (
    <div>
      <PageTitle title="Personal Details" />
      <div className="p-3 mt-10">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label>Lastname</Label>
            <Input value={details.last_name} />
          </div>
          <div>
            <Label>Firstname</Label>
            <Input value={details.first_name} />
          </div>
          <div>
            <Label>Gender</Label>
            <Input value={details.gender} />
          </div>
          <div>
            <Label>Preferred Language</Label>
            <Input value={details.home_language} />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={details.country} />
          </div>
          {details.address && (
            <div>
              <Label>Address</Label>
              <Input value={details.address} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
