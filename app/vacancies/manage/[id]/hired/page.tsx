import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
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
import Link from "next/link";
import getInitials from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";

export const revalidate = 0;

const HiredCandidates = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [applications, user] = await Promise.all([
    prisma.vacancy_applications.findMany({
      where: {
        vacancy_id: id,
        status: "Hired",
      },
      include: {
        user: {
          select: { first_name: true, last_name: true, province: true },
        },
        resume: {
          select: {
            name: true,
          },
        },
      },
    }),
    getProfile(),
  ]);

  if (!user) redirect("/dashboard");

  //
  return (
    <>
      <PageTitle
        title="Hired Candidates"
        description="View and manage hired candidates for this applications"
      />
      <div className="my-6">
        <Separator />
      </div>
      <Table className="mt-7">
        <TableCaption>All Vacancies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((app, index) => {
            const fullName = `${app.user.first_name} ${app.user.last_name}`;
            const initials = getInitials(fullName);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="font-bold">{fullName}</h1>
                      <h4 className="text-sm text-muted-foreground">
                        {" "}
                        from {app.user.province || "South Africa"}
                      </h4>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{app.resume.name}</TableCell>

                <TableCell className="text-xs">
                  {moment(app.created_at).fromNow()}
                </TableCell>

                <TableCell className="items-center justify-end flex gap-3">
                  <Link
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })}
                    href={`/vacancies/manage/${id}/applications/${app.id}`}
                  >
                    View
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

export default HiredCandidates;
