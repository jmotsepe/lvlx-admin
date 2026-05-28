import PageTitle from "@/components/main/PageTitle";
import React from "react";
import CreateInvite from "./CreateInvite";
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
import getProfile from "@/actions/user";

export const revalidate = 0;

const Invitations = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  //
  const user = await getProfile();

  if (user.role === "Youth") redirect("/dashboard");

  const invites = await prisma.invite.findMany({
    where: {
      company_id: id,
    },
    include: {
      user: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <PageTitle
          title="Invitations"
          description="Manage all users invited to the platform by the company."
        />
        <CreateInvite id={id} />
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
