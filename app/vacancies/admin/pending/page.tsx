import getProfile from "@/actions/user";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import PageTitle from "@/components/main/PageTitle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
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
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import ApproveVacancy from "../ApproveVacancy";
import RejectVacancy from "../RejectVacancy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const revalidate = 0;

const PendingVacancies = async () => {
  //

  const user = await getProfile();

  if (user?.role !== "Admin") redirect("/dashboard");

  const vacancies = await prisma.vacancy.findMany({
    where: {
      close_date: {
        gt: new Date(),
      },
      status: { not: "Approved" },
    },
    include: {
      company: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <PageTitle
          title="My Vacancies"
          description="Manage vacancies from all available companies"
          goBack
        />
      </div>

      <Table className="mt-7">
        <TableCaption>All Vacancies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vacancies?.map((vacancy, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        <Building2 />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-lg font-bold">
                        {vacancy.company.name}
                      </h1>
                      <h6 className="text-sm text-muted-foreground">
                        {vacancy.company.department}
                      </h6>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{vacancy.location}</TableCell>

                <TableCell className="text-xs">
                  {moment(vacancy.created_at).fromNow()}
                </TableCell>
                <TableCell className="items-center justify-end flex gap-3">
                  <Link
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })}
                    href={`/vacancies/manage/${vacancy.id}`}
                  >
                    View
                  </Link>
                  {vacancy.status !== "Approved" && (
                    <ApproveVacancy id={vacancy.id} />
                  )}
                  {vacancy.status !== "Rejected" && (
                    <RejectVacancy id={vacancy.id} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingVacancies;
