import React from "react";
import Stats from "./Stats";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteApplication from "@/app/applications/DeleteApplication";
import { Building2Icon, Computer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const YouthDashboard = async ({ userID }: { userID: string }) => {
  const jobs = await prisma.vacancy_applications.findMany({
    where: { user_id: userID },
    take: 10,
    orderBy: { created_at: "desc" },
    include: {
      resume: true,
      vacancy: { include: { company: true } },
    },
  });
  return (
    <>
      <Stats userID={userID} />
      <Separator className="my-5" />
      <div className="mt-5">
        <h1 className="font-bold text-2xl">Recently Applied Jobs</h1>
        <Table className="mt-7">
          <TableCaption>All Vacancies</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead className="w-[400px]">Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs?.map((job, index) => {
              const { vacancy } = job;
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="capitalize w-[400px] ">
                    {vacancy.title}
                  </TableCell>
                  <TableCell className="text-sm">{vacancy.location}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant={"secondary"}>{vacancy.company.name}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {moment(job.created_at).fromNow()}
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge>{job.status}</Badge>
                  </TableCell>
                  <TableCell className="items-center justify-end flex gap-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">View</Button>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default YouthDashboard;
