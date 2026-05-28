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
import DeleteUser from "./DeleteUser";
import moment from "moment";

import getInitials from "@/lib/utils";
import { profiles } from "@prisma/client";
import UpdateUser from "./UpdateUser";

const UsersList = async ({ users }: { users: profiles[] }) => {
  return (
    <div>
      <Table>
        <TableCaption>All Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Full names</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user, index) => {
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
                  <Badge variant={"outline"}>{user.role}</Badge>
                </TableCell>

                <TableCell className="text-xs">
                  {moment(user.created_at).fromNow()}
                </TableCell>

                <TableCell className="items-center justify-end flex gap-3">
                  <UpdateUser profile={user} />
                  <DeleteUser id={user.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
