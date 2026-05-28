import getProfile from "@/actions/user";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import getInitials from "@/lib/utils";
import moment from "moment";

export const revalidate = 0;

const SponsoredTalents = async () => {
  const user = await getProfile();

  if (user.role !== "Sponsor") redirect("/dashboard");

  const talents = await prisma.profiles.findMany({
    where: { sponsor: user.id },
    include: {
      _count: {
        select: {
          resume: true,
        },
      },
    },
  });

  return (
    <div>
      <PageTitle
        title="My sponsored talents"
        description="Manage all users you invited into the platform"
      />
      <Table>
        <TableCaption>All Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Full names</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Resumes</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talents?.map((user, index) => {
            const fullname = `${user.first_name} ${user.last_name}`;
            const initials = getInitials(fullname);

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h6 className="font-bold">{fullname}</h6>
                      <span className="text-xs lowercase text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{user.gender}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>
                    {user._count.resume} Resumes
                  </Badge>
                </TableCell>

                <TableCell className="text-xs">
                  {moment(user.created_at).fromNow()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SponsoredTalents;
