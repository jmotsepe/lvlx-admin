import React from "react";
import PageTitle from "@/components/main/PageTitle";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import AddExperience from "./AddExperience";
import UpdateExperience from "./UpdateExperience";
import DeleteExperience from "./DeleteExperience";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const WorkExperiences = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;

  const workExperience = await prisma.work_experience.findMany({
    where: { resume_id: id },
  });

  return (
    <>
      <div className="flex items-center gap-4 justify-between flex-wrap">
        <PageTitle title="Work Experience" />
        <AddExperience id={id} />
      </div>

      <div className="mt-8">
        <Table>
          <TableCaption>My Work Experiences</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date Started</TableHead>
              <TableHead>Date Ended</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workExperience?.map((res, index) => {
              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div
                      className={buttonVariants({
                        size: "icon",
                        variant: "outline",
                      })}
                    >
                      <Building size={16} />
                    </div>
                    <h6 className="text-base">{res.position}</h6>
                  </TableCell>
                  <TableCell>
                    <h6>{res.company}</h6>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outline"} className="font-light">
                      ● {res.date}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outline"} className="font-light">
                      ● {res?.date_ended}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-4">
                      <UpdateExperience experience={res} />
                      <DeleteExperience id={res.id} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default WorkExperiences;
