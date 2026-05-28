import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import getInitials from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import moment from "moment";

export default async function RecentSales() {
  //
  const transactions = await prisma.transactions.findMany({
    take: 10,
    orderBy: {
      created_at: "desc",
    },
    include: {
      company: { select: { name: true, department: true } },
    },
  });

  return (
    <Card>
      <CardHeader>
        <h1 className="font-bold text-lg">Recent Transactions</h1>
        <p className="text-sm text-muted-foreground">
          View last 10 transactions made
        </p>
      </CardHeader>

      <CardContent>
        {transactions.map((transaction, index) => {
          const company = getInitials(transaction.company.name);
          return (
            <div className="flex items-center mb-5" key={index}>
              <Avatar className="h-9 w-9">
                <AvatarFallback>{company}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.company.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.company.department}
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground font-medium">
                {moment(transaction.created_at).fromNow()}
              </div>
              <div className="ml-auto font-medium">
                R{transaction.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
