import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Building2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import getProfile from "@/actions/user";

export const revalidate = 0;

const InterviewsPage = async () => {
  const user = await getProfile();

  // if (user.role !== "Youth") redirect("/dashboard");

  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        user_id: { equals: user.id },
      },
    },
    include: {
      application: true,
      vacancy: { include: { company: true } },
    },
  });

  return (
    <>
      <PageTitle
        title="Interviews"
        description="See list of all interviews you are scheduled to attend"
      />
      <Table className="mt-7">
        <TableCaption>All Interviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews?.map((interview, index) => {
            const vacancy = interview.vacancy;
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">
                  {vacancy.company.name}
                </TableCell>
                <TableCell>
                  <Badge>{interview.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>
                    {moment(interview.date).fromNow()}
                  </Badge>
                </TableCell>
                <TableCell>{interview.time}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">View Interview</Button>
                    </SheetTrigger>
                    <SheetContent
                      className="md:w-[600px] lg:w-[800px] w-full"
                      side={"right"}
                    >
                      <SheetHeader>
                        <SheetTitle>Job Application</SheetTitle>
                        <SheetDescription>{vacancy.title}</SheetDescription>
                      </SheetHeader>

                      <div>
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
                        <div className="px-4 my-4 flex flex-col w-full gap-4">
                          <div>
                            <Label>Interview Type</Label>
                            <Input value={interview?.type} />
                          </div>
                          <div>
                            <Label>Date</Label>
                            <Input
                              value={moment(interview?.date).format(
                                "MMMM DD, YYYY"
                              )}
                            />
                          </div>
                          {interview.time && (
                            <div>
                              <Label>Time</Label>
                              <Input value={interview?.time} />
                            </div>
                          )}
                          {interview.location && (
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={
                                  interview.location ? interview.location : "-"
                                }
                              />
                            </div>
                          )}
                          {interview.description && (
                            <div>
                              <Label>Details</Label>
                              <Textarea value={interview.description} />
                            </div>
                          )}
                          {interview.meeting_link && (
                            <Button className="w-full" variant={"green"}>
                              Interview Link
                            </Button>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default InterviewsPage;
