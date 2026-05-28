import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import getProfile from "@/actions/user";
import { UsersDataTable } from "../components/UsersDataTable";

export const revalidate = 0;

const Users = async () => {
  //
  await getProfile();
  const users = await prisma.profiles.findMany({
    where: { status: "Approved" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageTitle title="Active Users" />
      </div>
      <div className="mt-7">
        <UsersDataTable data={users} />
      </div>
    </>
  );
};

export default Users;
