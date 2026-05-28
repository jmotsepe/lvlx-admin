import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";
import { AdminsDataTable } from "../components/AdminsDataTable";

export const revalidate = 0;

const Users = async () => {
  //
  await getProfile();
  const users = await prisma.profiles.findMany({
    where: { role: "Admin" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle
          title="Manage Admins"
          description="Manage all users with the role of admin"
        />
        <div className="flex items-center gap-4 flex-wrap">
          {/* TODO FInish user search */}
          {/* <SearchUser /> */}
          {/* <Button className="gap-4" variant={"outline"}>
            <SaveAll size={14} />
            Export
          </Button> */}
        </div>
      </div>
      <div className="mt-7">
        <AdminsDataTable data={users} />
      </div>
    </>
  );
};

export default Users;
