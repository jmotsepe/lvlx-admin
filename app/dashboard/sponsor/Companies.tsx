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
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import getInitials from "@/lib/utils";
import getProfile from "@/actions/user";

const Companies = async () => {
  const user = await getProfile();

  const companies = await prisma.company.findMany({
    where: {
      company_manager: {
        some: {
          user_id: user.id,
        },
      },
    },
    include: {
      user: true,
      _count: {
        select: { company_manager: true },
      },
    },
  });

  return (
    <Table>
      <TableCaption>All Companies</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Managers</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies?.map((company, index) => {
          const fullName = `${company.user.last_name} ${company.user.first_name}`;
          const initials = getInitials(fullName);

          const companyInitials = getInitials(company.name);
          return (
            <TableRow key={index}>
              <TableCell className="capitalize font-bold">
                <div className="flex gap-3 items-center">
                  <Avatar className="bg-primary">
                    <AvatarFallback className="bg-primary text-black">
                      {companyInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h6 className="font-bold">{company.name}</h6>
                    <span className="text-xs font-light text-foreground">
                      Added {moment(company.created_at).fromNow()}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">
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
              <TableCell className="text-xs">
                <Badge variant={"outline"}>
                  {company._count.company_manager} Managers
                </Badge>
              </TableCell>

              <TableCell className="text-xs">
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
                  View
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default Companies;
