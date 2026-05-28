import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import getProfile from "@/actions/user";

export const revalidate = 0;

const InterviewsPage = async () => {
  const user = await getProfile();

  if (user.role !== "Employer") redirect("/dashboard");

  const interviews = await prisma.interview.findMany({
    where: {
      vacancy: {
        company: {
          company_manager: {
            some: {
              user_id: {
                equals: user.id,
              },
            },
          },
        },
      },
    },
    include: {
      application: true,
      vacancy: { include: { company: true } },
    },
  });

  return (
    <>
      <PageTitle
        title="Interviews"
        description="See a list of all interviews under companies you manage."
      />
      <Table className="mt-7">
        <TableCaption>All Interviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews?.map((interview, index) => {
            const vacancy = interview.vacancy;
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">
                  {vacancy.company.name}
                </TableCell>
                <TableCell>
                  <Badge>{interview.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>
                    {moment(interview.date).fromNow()}
                  </Badge>
                </TableCell>
                <TableCell>{interview.time}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-5">
                    <Link
                      className={buttonVariants({ size: "sm" })}
                      href={`/vacancies/manage/${interview.vacancy_id}`}
                    >
                      View Vacancy
                    </Link>
                    <Link
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                      href={`/interviews/live?id=${interview.id}`}
                    >
                      View Interview
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default InterviewsPage;
