import React from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteCompany from "./DeleteCompany";
import getProfile from "@/actions/user";

export const revalidate = 0;

const DeleteCompanyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  await getProfile();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Are You Sure?</CardTitle>
          <CardDescription>
            Deleting this company will also delete all related items
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="pb-4">
          <DeleteCompany id={id} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteCompanyPage;
