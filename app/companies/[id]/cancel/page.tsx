import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const CancelPaymentURL = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tier: string; token: string }>;
}) => {
  const user = await getProfile();

  const { tier, token } = await searchParams;
  const { id } = await params;

  await prisma.$transaction(async (tx) => {
    const existingToken = await tx.token.findFirst({
      where: { token: token, company_id: id },
    });

    if (existingToken) {
      await tx.token.delete({ where: { id: existingToken.id } });
    }
  });

  if (!user || user.role === "Youth") {
    redirect("/dashboard");
    return;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <XCircle className="w-12 h-12 text-destructive mb-4" />
        <CardTitle className="text-2xl font-bold text-center">
          Payment Canceled
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Your payment has been canceled. No charges have been made to your
          account.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pb-5">
        <Link className={buttonVariants()} href={`/companies/${id}`}>
          Back to company
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CancelPaymentURL;
