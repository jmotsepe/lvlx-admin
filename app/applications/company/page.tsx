import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import React from "react";
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
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import getProfile from "@/actions/user";

export const revalidate = 0;

const JobApplications = async () => {
  const user = await getProfile();

  const applications = await prisma.vacancy_applications.findMany({
    where: {
      vacancy: {
        company: {
          company_manager: {
            some: {
              user_id: user.id,
            },
          },
        },
      },
    },
    include: {
      resume: true,
      vacancy: { include: { company: true } },
    },
  });

  return (
    <>
      <PageTitle
        title="Vacancy Applications"
        description="Discover all applications sent for available vacancies."
      />

      <Table className="mt-7">
        <TableCaption>All Vacancies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((job, index) => {
            const { vacancy } = job;
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">{vacancy.title}</TableCell>
                <TableCell className="text-sm">{vacancy.location}</TableCell>
                <TableCell className="text-xs">
                  <Badge variant={"secondary"}>{vacancy.company.name}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  <Badge>{job.status}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {moment(job.created_at).fromNow()}
                </TableCell>

                <TableCell className="items-center justify-end flex gap-3">
                  <Link
                    href={`/vacancies/manage/${job.vacancy_id}/applications/${job.id}`}
                    className={buttonVariants()}
                  >
                    View Application
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default JobApplications;
