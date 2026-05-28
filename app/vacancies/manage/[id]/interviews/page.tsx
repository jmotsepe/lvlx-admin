import React from "react";
import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import getInitials from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { interview, profiles } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const revalidate = 0;

const InterviewingPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [interviews, user] = await Promise.all([
    prisma.interview.findMany({
      where: {
        vacancy_id: id,
      },
      include: {
        application: {
          include: {
            user: true,
          },
        },
      },
    }),
    getProfile(),
  ]);

  const myInt: (interview & {
    application: {
      user: profiles | null;
    };
  })[] = interviews;

  console.log(myInt);

  if (!user) redirect("/dashboard");

  //
  return (
    <>
      <PageTitle
        title="Interviews"
        description="View and manage vacancy interviews"
      />
      <div className="my-6">
        <Separator />
      </div>
      <Table className="mt-7">
        <TableCaption>All Interviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews?.map((interview, index) => {
            const user = interview.application.user;
            const fullName = `${user.first_name} ${user.last_name}`;
            const initials = getInitials(fullName);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="font-bold">{fullName}</h1>
                      <h4 className="text-sm text-muted-foreground">
                        {" "}
                        from {user.province || "South Africa"}
                      </h4>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {moment(interview.date).fromNow()}
                </TableCell>

                <TableCell className="text-xs">{interview.type}</TableCell>
                <TableCell className="items-center justify-end flex gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">View</Button>
                    </SheetTrigger>
                    <SheetContent
                      className="md:w-[600px] lg:w-[800px] w-full"
                      side={"right"}
                    >
                      <SheetHeader className="mb-3">
                        <SheetTitle>Interview</SheetTitle>
                      </SheetHeader>

                      <ScrollArea className="h-full">
                        <div className="mb-5 rounded-none">
                          <div className="my-4 flex flex-col w-full gap-4">
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
                                    interview.location
                                      ? interview.location
                                      : "-"
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
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                  <Link
                    className={buttonVariants()}
                    href={`/vacancies/manage/${id}/applications/${interview.application_id}`}
                  >
                    Application
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default InterviewingPage;
