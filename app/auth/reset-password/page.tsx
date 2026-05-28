import React from "react";
import ResetPassword from "./form";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md pb-5">
        <CardHeader className="flex flex-col items-center justify-center">
          <Image
            alt="logo"
            height={50}
            width={40}
            src="/lvlx-dark.png"
            className="mb-2.5"
          />
          <CardTitle className="text-2xl font-bold text-center">
            Set New Password
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your new password below
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-4 items-center justify-center">
          <p className="text-sm text-gray-600">Reset your password? </p>
          <Link className={buttonVariants()} href="/auth/forgot-password">
            Reset Password
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

const PasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) => {
  //

  const { code } = await searchParams;

  if (!code) return <ErrorPage />;

  return <ResetPassword code={code} />;
};

export default PasswordPage;
