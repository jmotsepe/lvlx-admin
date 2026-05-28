import React from "react";
import PageTitle from "@/components/main/PageTitle";
import AddEducation from "./AddEducation";
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
import { GraduationCapIcon } from "lucide-react";
import DeleteEducation from "./DeleteEducation";
import UpdateEducation from "./UpdateEducation";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const EducationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;

  const personalData = await prisma.education_details.findMany({
    where: { resume_id: id },
  });

  return (
    <>
      <div className="flex items-center gap-4 justify-between flex-wrap">
        <PageTitle
          title="Education Details"
          description="Update resume's educational details"
        />
        <AddEducation id={id} />
      </div>

      <div className="mt-8">
        <Table>
          <TableCaption>My Educations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Started</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalData?.map((res, index) => {
              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div
                      className={buttonVariants({
                        size: "icon",
                      })}
                    >
                      <GraduationCapIcon size={16} />
                    </div>
                    <h6 className="text-base">{res.title}</h6>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>
                      {res.status === "Active"
                        ? "In Progress"
                        : res.status === "NotCompleted"
                        ? "Not Completed"
                        : res.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outline"} className="font-light">
                      ● {res.year_started}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-4">
                      <UpdateEducation education={res} />
                      <DeleteEducation id={res.id} />
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

export default EducationPage;
