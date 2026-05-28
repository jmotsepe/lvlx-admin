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
import { User2 } from "lucide-react";
import UpdateReference from "./UpdateReference";
import DeleteReference from "./DeleteReference";
import AddReference from "./AddReference";

export const revalidate = 0;

import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";

const WorkExperiences = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;
  await getProfile();

  const references = await prisma.references.findMany({
    where: { resume_id: id },
  });

  return (
    <>
      <div className="flex items-center gap-4 justify-between flex-wrap">
        <PageTitle title="References" />
        <AddReference id={id} />
      </div>

      <div className="mt-8">
        <Table>
          <TableCaption>My References</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references?.map((res, index) => {
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
                      <User2 size={16} />
                    </div>
                    <h6 className="text-base">{res.name}</h6>
                  </TableCell>
                  <TableCell>
                    <h6>{res.institution}</h6>
                  </TableCell>
                  <TableCell>
                    <Badge>● {res.email}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-4">
                      <UpdateReference reference={res} />
                      <DeleteReference id={res.id} />
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
