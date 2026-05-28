import PageTitle from "@/components/main/PageTitle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import DeleteVacancy from "./DeleteVacancy";
import { prisma } from "@/prisma/prisma";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getProfile from "@/actions/user";

export const revalidate = 0;

const CompanyVacancies = async () => {
  const user = await getProfile();

  const vacancies = await prisma.vacancy.findMany({
    where: {
      company: {
        company_manager: {
          some: {
            user: {
              id: user.id,
            },
          },
        },
      },
      close_date: {
        gt: new Date(),
      },
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      company: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <PageTitle
          title="My Vacancies"
          description="Manage vacancies from all your companies"
        />
        <Link className={buttonVariants()} href="/vacancies/manage/new">
          Add Vacancy
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vacancies.map((job) => {
          return (
            <Card key={job.id} className="pb-4">
              <CardHeader>
                <CardTitle className="text-md mb-4">
                  <div>
                    <h1 className="mb-1 text-lg line-clamp-2">{job.title}</h1>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge className="text-xs">
                        {job.monthly_salary
                          ? `R${parseFloat(job.monthly_salary).toFixed(
                              2
                            )} / Month`
                          : "Not Specified"}
                      </Badge>
                      <Badge variant={"outline"} className="text-xs">
                        {moment(job.created_at).fromNow()}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-4">
                  {job.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={`/vacancies/manage/${job.id}`}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "w-full",
                  })}
                >
                  View Vacancy
                </Link>
                <DeleteVacancy id={job.id} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CompanyVacancies;
