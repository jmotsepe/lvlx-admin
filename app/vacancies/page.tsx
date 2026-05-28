import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import moment from "moment";
import InstantApply from "./InstantApply";
import getProfile from "@/actions/user";

export const revalidate = 0;

const AllVacancies = async () => {
  const user = await getProfile();

  const [vacancies, resumes] = await Promise.all([
    prisma.vacancy.findMany({
      where: {
        status: "Approved",
      },
      include: {
        company: true,
        applications: {
          where: {
            user_id: user.id,
          },
        },
      },
    }),
    prisma.resume.findMany({
      where: { AND: { user_id: user.id, available: true } },
    }),
  ]);

  return (
    <>
      <PageTitle
        description="Apply for jobs via LVLX"
        title="Available Vacancies"
      />
      {vacancies.length === 0 ? (
        <div className="mt-10 flex justify-center">
          <Card className="max-w-md w-full text-center p-6">
            <CardHeader>
              <CardTitle className="text-xl">No Vacancies Available</CardTitle>
              <CardDescription className="mt-2">
                There are currently no job vacancies available. Please check
                back later as new opportunities are added regularly.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vacancies.map((job) => {
            return (
              <Card key={job.id} className="pb-4">
                <CardHeader>
                  <CardTitle className="text-md mb-4">
                    <div>
                      <h1 className="mb-1 text-lg line-clamp-1">{job.title}</h1>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/"
                          className="text-xs font-normal underline"
                        >
                          @{job.company.name}
                        </Link>
                        <span>-</span>
                        <Badge variant={"outline"} className="text-xs">
                          {moment(job.created_at).fromNow()}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="mt-4">
                      {job.monthly_salary
                        ? `R${parseFloat(job.monthly_salary).toFixed(
                            2
                          )} / Month`
                        : "Not Specified"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-4">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.applications.length === 0 ? (
                    <InstantApply
                      resumes={resumes}
                      vacancyID={job.id}
                      userID={user.id}
                    />
                  ) : (
                    <Button variant={"destructive"} className="w-full">
                      Already Applied
                    </Button>
                  )}
                  <Link
                    href={`/vacancies/${job.id}`}
                    className={buttonVariants({
                      variant: "secondary",
                      className: "w-full",
                    })}
                  >
                    View Vacancy
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AllVacancies;
