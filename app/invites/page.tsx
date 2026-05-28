import PageTitle from "@/components/main/PageTitle";
import React from "react";
import CreateInvite from "./CreateInvite";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
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
import moment from "moment";
import DeleteInvite from "./DeleteInvite";

export const revalidate = 0;

const Invitations = async () => {
  const user = await getProfile();
  if (!user) redirect("/auth/get-started");

  if (user.role === "Youth") redirect("/dashboard");

  const getInvites = async () => {
    if (user.role === "Admin") {
      const invites = await prisma.invite.findMany({
        include: {
          user: true,
        },
      });

      return invites;
    } else {
      const invites = await prisma.invite.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          user: true,
        },
      });

      return invites;
    }
  };

  const [invites, companies] = await Promise.all([
    getInvites(),
    prisma.company.findMany({
      where: {
        company_manager: {
          some: {
            user_id: user.id,
          },
        },
      },
    }),
  ]);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <PageTitle
          title="Invitations"
          description="Manage all users invited to the platform"
        />
        {user.role !== "Admin" && <CreateInvite companies={companies} />}
      </div>

      <Table className="mt-7">
        <TableCaption>All Invites</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites?.map((invite, index) => {
            const user = invite.user;
            const fullname = `${user?.first_name} ${user?.last_name}`;
            return (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                <TableCell className="whitespace-nowrap font-bold">
                  {invite.name}
                </TableCell>
                <TableCell className="whitespace-nowrap font-bold">
                  {invite.email}
                </TableCell>
                <TableCell className="whitespace-nowrap font-bold">
                  {fullname}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {moment(invite.created_at).fromNow()}
                </TableCell>
                <TableCell className="items-center justify-end flex gap-3">
                  <DeleteInvite id={invite.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default Invitations;
