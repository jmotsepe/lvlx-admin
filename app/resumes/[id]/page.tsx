import Stat from "@/components/custom/stat";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
import {
  Briefcase,
  Building,
  Building2Icon,
  CheckSquare,
  Computer,
  ListFilter,
} from "lucide-react";
import React from "react";
import moment from "moment";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteApplication from "@/app/applications/DeleteApplication";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getProfile from "@/actions/user";
import { validateResume } from "@/actions/resume";
import Link from "next/link";

export const revalidate = 0;

const SingleResume = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //

  const { id } = await params;

  await getProfile();

  const [vacancies, interviewed, hired, shortlisted, jobs, resume] =
    await Promise.all([
      prisma.vacancy_applications.count({ where: { resume_id: id } }),
      prisma.vacancy_applications.count({
        where: { resume_id: id, status: "Interview" },
      }),
      prisma.vacancy_applications.count({
        where: { resume_id: id, status: "Hired" },
      }),
      prisma.vacancy_applications.count({
        where: { resume_id: id, status: "ShortListed" },
      }),
      prisma.vacancy_applications.findMany({
        where: { resume_id: id },
        take: 10,
        orderBy: { created_at: "desc" },
        include: {
          resume: true,
          vacancy: { include: { company: true } },
        },
      }),
      prisma.resume.findUnique({ where: { id } }),
    ]);
  return (
    <>
      {resume?.type === "File" && (
        <Card className="mb-5">
          <CardHeader>
            <CardTitle className="font-black">Upload CV</CardTitle>
            <CardDescription>
              Click the button below to upload your resume.
            </CardDescription>
            <CardFooter className="px-0 mt-5">
              <Link className={buttonVariants()} href={`/resumes/${id}/upload`}>
                Upload File
              </Link>
            </CardFooter>
          </CardHeader>
        </Card>
      )}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat
          Icon={Building}
          title="Applied Vacancies"
          value={vacancies}
          color="blue"
        />
        <Stat
          Icon={CheckSquare}
          title="Interviewing Jobs"
          value={interviewed}
          color="purple"
        />
        <Stat
          Icon={ListFilter}
          title="Shortlisted Jobs"
          value={shortlisted}
          color="green"
        />
        <Stat
          Icon={Briefcase}
          title="Hired Jobs"
          value={hired}
          color="orange"
        />
      </div>
      <Separator className="my-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs?.map((job, index) => {
          const { vacancy } = job;
          return (
            <Card key={index}>
              <CardContent>
                <div>
                  <div className="flex items-center gap-4 mt-4">
                    <Building2Icon
                      color="black"
                      size={40}
                      className="p-1.5 bg-primary rounded-lg"
                    />
                    <div>
                      <h1 className="font-bold text-lg">
                        {vacancy.company.name}
                      </h1>

                      <h6 className="text-xs line-clamp-1">
                        @{vacancy.company.address}
                      </h6>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <Badge
                      variant={"secondary"}
                      className="w-full mb-3 text-center"
                    >
                      <p className="w-full text-center">
                        {moment(job.created_at).format("DD MMM YYYY")}
                      </p>
                    </Badge>
                    <h1 className="font-bold line-clamp-2 mb-4">
                      {vacancy.title}
                    </h1>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-full">View Application</Button>
                      </SheetTrigger>
                      <SheetContent
                        className="md:w-[600px] lg:w-[800px] w-full"
                        side={"right"}
                      >
                        <SheetHeader>
                          <SheetTitle>Job Application</SheetTitle>
                          <SheetDescription>{vacancy.title}</SheetDescription>
                        </SheetHeader>

                        <ScrollArea className="h-full">
                          <div className="mt-4">
                            {job.status === "Pending" && (
                              <DeleteApplication id={job.id} />
                            )}
                          </div>
                          <div className="mt-4 mb-10">
                            <Separator className="my-4" />
                            <div className="flex items-center gap-4 mt-4">
                              <Building2Icon
                                color="black"
                                size={40}
                                className="p-1.5 bg-primary rounded-lg"
                              />
                              <div>
                                <h1 className="font-bold text-lg">
                                  {vacancy.company.name}
                                </h1>
                                <h6 className="text-xs">
                                  @{vacancy.company.address}
                                </h6>
                              </div>
                            </div>

                            <div className="mt-4">
                              <Label>Applied On</Label>
                              <Input
                                value={moment(job.created_at).format(
                                  "DD MMM YYYY"
                                )}
                              />
                            </div>
                            <div className="mt-4">
                              <Label>Status</Label>
                              <Input value={job.status} />
                            </div>
                            <div className="flex flex-col mt-4 gap-3">
                              {vacancy.remote && (
                                <div className="flex items-center gap-4 my-3">
                                  <Button size={"icon"} variant={"outline"}>
                                    <Computer size={18} />
                                  </Button>
                                  <div>
                                    <h1 className="font-bold text-lg text-primary">
                                      Remote Job
                                    </h1>
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-1 gap-5">
                                <div>
                                  <Label>Salary</Label>
                                  <div className="mt-2">
                                    <Input
                                      value={
                                        vacancy.monthly_salary
                                          ? `R${vacancy.monthly_salary} / Month`
                                          : "No Specified Salary"
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Available Positions</Label>
                                  <div className="mt-2">
                                    <Input
                                      value={
                                        vacancy.slots
                                          ? vacancy.slots === "1"
                                            ? "1 Person Needed"
                                            : `${vacancy.slots} People Needed`
                                          : "Not Specified"
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <div className="mt-2">
                                    <Input
                                      value={
                                        vacancy.location
                                          ? vacancy.location
                                          : "Not Specified"
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5">
                                <Label>Description</Label>
                                <Separator />
                                <p className="mt-2 text-sm font-light">
                                  {vacancy.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SingleResume;
