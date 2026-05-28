import React from "react";
import Stats from "./Stats";
import { CircleDollarSign } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import getProfile from "@/actions/user";
import { getPaymentToken } from "../../actions";

export const revalidate = 0;

const SingleCompany = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  await getProfile();

  const [points, transactions, tiers, token] = await Promise.all([
    prisma.points.findUnique({ where: { company_id: id } }),

    prisma.transactions.findMany({
      where: { company_id: id },
      take: 10,
      include: { user: true },
    }),

    prisma.point_tiers.findMany({}),

    getPaymentToken(id),
  ]);
  return (
    <div className="w-full">
      <Card className="p-4 mb-6 flex justify-between items-center gap-4 bg-slate-900 dark:bg-gray-950 text-white">
        <div>
          <div className="flex items-center gap-x-2">
            <CircleDollarSign />
            <h1 className="font-black text-4xl text-primary">
              {points?.balance || 0}
            </h1>
          </div>
          <div>
            <h1 className="font-bold text-lg">Credits Balance</h1>
            <p className="text-xs">You can purchase an additional credits</p>
          </div>
        </div>
      </Card>
      <Stats company={id} />
      <div>
        <h1 className="font-bold text-2xl mt-10">Recent Transactions</h1>
        <Table className="mt-7">
          <TableCaption>All Invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="capitalize">
                    {item.user.first_name} {item.user.last_name}
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge>R{item.amount.toFixed(2)}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {moment(item.created_at).fromNow()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SingleCompany;
