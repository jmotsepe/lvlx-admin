import getProfile from "@/actions/user";
import PageTitle from "@/components/main/PageTitle";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/prisma/prisma";
import { work_experience } from "@prisma/client";
import { Building } from "lucide-react";
import React from "react";

export const revalidate = 0;

const Experience = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await getProfile();
  const experiences = await prisma.work_experience.findMany({
    where: { resume_id: id },
  });

  return (
    <div>
      <PageTitle title="Work Experiences" />

      <div className="mt-8">
        <Table>
          <TableCaption>Work Experiences</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date Started</TableHead>
              <TableHead>Date Ended</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences?.map((res, index) => {
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Experience;
