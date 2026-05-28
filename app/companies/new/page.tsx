import React from "react";
import CreateNewCompany from "./Form";
import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import getProfile from "@/actions/user";

export const revalidate = 0;

const NewCompany = async () => {
  //
  const user = await getProfile();

  return (
    <>
      <PageTitle
        title="Create Company"
        description="Create and manage companies used to list jobs within LVLX"
        goBack
      />
      <div className="py-6">
        <Separator />
      </div>
      <CreateNewCompany role={user.role} userID={user.id} />
    </>
  );
};

export default NewCompany;
