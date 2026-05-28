import React from "react";
import GetStartedForm from "./Form";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import { getUser } from "@/actions/auth";

export const revalidate = 0;

const GetStarted = async () => {
  //

  const user = await getUser();
  const profile = await prisma.profiles.findUnique({ where: { id: user.id } });

  if (profile) redirect("/dashboard");

  return (
    <div className="w-full mx-auto max-w-lg py-10 px-4">
      <GetStartedForm />
    </div>
  );
};

export default GetStarted;
