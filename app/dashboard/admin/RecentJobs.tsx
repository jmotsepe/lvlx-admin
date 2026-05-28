import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import getInitials from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import Link from "next/link";

export default async function RecentJobs() {
  //
  const vacancies = await prisma.vacancy.findMany({
    take: 10,
    orderBy: {
      created_at: "desc",
    },
    include: {
      company: { select: { name: true } },
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div>
            <h1 className="font-bold text-lg">Recent Vacancies</h1>
            <p className="text-sm text-muted-foreground">
              View last 10 vacancies added
            </p>
          </div>
          <Link
            className={buttonVariants({ size: "sm" })}
            href="/vacancies/admin"
          >
            View All
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {vacancies.map((vacancy, index) => {
          const company = getInitials(vacancy.company.name);
          return (
            <div className="flex items-center mb-5" key={index}>
              <Avatar className="h-9 w-9">
                <AvatarFallback>{company}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none line-clamp-1">
                  {vacancy.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {vacancy.location}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Badge>{vacancy.status}</Badge>
              </div>
              <div className="ml-auto font-medium">
                {vacancy.monthly_salary
                  ? `R${vacancy.monthly_salary}`
                  : "Salary Unavailable"}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
