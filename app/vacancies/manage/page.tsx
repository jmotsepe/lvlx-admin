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
import DeleteVacancy from "./DeleteVacancy";
import { prisma } from "@/prisma/prisma";
import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import getProfile from "@/actions/user";

export const revalidate = 0;

const CompanyVacancies = async () => {
  const user = await getProfile();

  const vacancies = await prisma.vacancy.findMany({
    where: {
      company: {
        company_manager: {
          some: {
            user: {
              id: user.id,
            },
          },
        },
      },
      close_date: {
        gt: new Date(),
      },
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      company: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <PageTitle
          title="My Vacancies"
          description="Manage vacancies from all your companies"
        />
        <Link className={buttonVariants()} href="/vacancies/company/new">
          Add Vacancy
        </Link>
      </div>

      <Table className="mt-7">
        <TableCaption>All Vacancies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Applications</TableHead>
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
                  <Badge variant={"secondary"}>
                    {vacancy._count.applications} Applications
                  </Badge>
                </TableCell>
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
                  <DeleteVacancy id={vacancy.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default CompanyVacancies;
