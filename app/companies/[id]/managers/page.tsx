import React from "react";
import PageTitle from "@/components/main/PageTitle";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/prisma/prisma";
import DeleteManager from "./DeleteManager";
import getInitials from "@/lib/utils";
import AddManager from "./AddManager";
import getProfile from "@/actions/user";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

const CompanyManagers = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [user, managers] = await Promise.all([
    getProfile(),
    prisma.company_manager.findMany({
      where: {
        company_id: id,
      },
      include: {
        user: true,
      },
    }),
  ]);

  return (
    <>
      <div className="flex items-center justify-between gap-5 flex-wrap mb-7">
        <PageTitle
          title="Managers"
          description="Manage who have access to this company"
        />
        <AddManager id={id} />
      </div>
      <Table className="mt-7">
        <TableCaption>All Managers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers?.map((manager, index) => {
            //
            const fullName = `${manager.user.first_name} ${manager.user.last_name}`;
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
                      <h4 className="text-xs">
                        Joined {moment(manager.user.created_at).fromNow()}
                      </h4>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant={"outline"}>{manager.user.role}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  Added {moment(manager.created_at).fromNow()}
                </TableCell>
                <TableCell className="items-center justify-end flex">
                  {user?.id !== manager.user_id && (
                    <DeleteManager id={manager.id} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default CompanyManagers;
