import getProfile from "@/actions/user";
import PageTitle from "@/components/main/PageTitle";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/prisma/prisma";
import React from "react";

export const revalidate = 0;

const Objectives = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await getProfile();
  const letter = await prisma.career_objectives.findUnique({
    where: { resume_id: id },
  });

  if (!letter)
    return (
      <Card className="m-5">
        <CardHeader>
          <CardTitle className="font-black">No Data Found</CardTitle>
          <CardDescription>
            There is no data to display for this item
          </CardDescription>
        </CardHeader>
      </Card>
    );

  return (
    <>
      <PageTitle title="Career objectives" />
      <div className="mt-5">
        <Textarea
          value={letter.objectives}
          rows={20}
          placeholder="Career Objectives"
        />
      </div>
    </>
  );
};

export default Objectives;
