import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import getProfile from "@/actions/user";

export const revalidate = 0;

const Return = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tier: string; token: string }>;
}) => {
  const { id } = await params;

  const user = await getProfile();
  if (!user) redirect("/auth/get-started");
  const { tier, token } = await searchParams;

  if (user.role === "Youth") {
    redirect("/dashboard");
  }

  await prisma.$transaction(async (tx) => {
    const [points, currentTier, currentToken] = await Promise.all([
      tx.points.findFirst({ where: { company_id: id } }),
      tx.point_tiers.findUnique({ where: { id: tier } }),
      tx.token.findFirst({ where: { token: token } }),
    ]);

    if (!currentTier || !currentToken || currentToken.used) return;

    const myTransaction = await tx.transactions.findFirst({
      where: { token: currentToken.token },
    });

    if (myTransaction) return;

    let pointsBalance = points ? points.balance : 0;

    if (!points) {
      await tx.points.create({
        data: { balance: 0, company_id: id },
      });
    }

    pointsBalance += parseInt(currentTier.points);

    await Promise.all([
      tx.points.update({
        where: { company_id: id },
        data: { balance: pointsBalance },
      }),
      tx.transactions.create({
        data: {
          amount: parseInt(currentTier.cost),
          company_id: id,
          user_id: user.id,
          token: currentToken.token,
        },
      }),
      tx.token.update({
        where: { id: currentToken.id },
        data: { used: true },
      }),
    ]);
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
        <CardTitle className="text-2xl font-bold text-center">
          Payment Successful
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Your payment has been processed successfully.
        </p>
        <div className="bg-green-100 border border-green-200 rounded-md p-4">
          <p className="text-center text-green-800 font-medium">
            Credits have been allocated to your company profile.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-5">
        <Link href={`/companies/${id}`}>View Company</Link>
      </CardFooter>
    </Card>
  );
};

export default Return;
