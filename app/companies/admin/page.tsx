import React from "react";
import PageTitle from "@/components/main/PageTitle";
import Link from "next/link";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import { faker } from "@faker-js/faker";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import getInitials from "@/lib/utils";
import getProfile from "@/actions/user";

export const revalidate = 0;

const AdminCompanies = async () => {
  const profile = await getProfile();

  if (!profile) redirect("/auth/get-started");

  if (profile.role !== "Admin") redirect("/dashboard");

  const [companies, pending] = await Promise.all([
    prisma.company.findMany({
      include: {
        user: true,
        _count: {
          select: { company_manager: true, vacancies: true },
        },
      },
      where: {
        status: "Approved",
      },
    }),
    prisma.company.count({ where: { status: "Pending" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
        <PageTitle
          description="Manage all companies under LVLX"
          title="Companies"
        />
        <Link
          href="/companies/admin/pending"
          className={buttonVariants({ variant: "black" })}
        >
          {pending} Unverified Companies
        </Link>
      </div>

      <Table>
        <TableCaption>All Companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Managers</TableHead>
            <TableHead>Vacancies</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company, index) => {
            const fullName = `${company.user.last_name} ${company.user.first_name}`;
            const initials = getInitials(fullName);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize font-bold whitespace-nowrap">
                  {company.name}
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap">
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h6 className="font-bold">{fullName}</h6>
                      <span className="text-xs font-light text-foreground">
                        Joined {moment(company.user.created_at).fromNow()}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  <Badge variant={"secondary"}>{company.department}</Badge>
                </TableCell>

                <TableCell className="text-xs whitespace-nowrap">
                  {company._count.company_manager} Managers
                </TableCell>

                <TableCell className="text-xs whitespace-nowrap">
                  {company._count.vacancies} Vacancies
                </TableCell>

                <TableCell className="text-xs whitespace-nowrap">
                  <Badge>{moment(company.created_at).fromNow()}</Badge>
                </TableCell>

                <TableCell className="items-center justify-end flex gap-3">
                  <Link
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })}
                    href={`/companies/${company.id}`}
                  >
                    View Company
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCompanies;
