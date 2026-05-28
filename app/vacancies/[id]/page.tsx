import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import { notFound } from "next/navigation";
import React from "react";
import InstantApply from "../InstantApply";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2Icon, Computer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import Image from "next/image";
import DeleteApplication from "@/app/applications/DeleteApplication";
import getProfile from "@/actions/user";

export const revalidate = 0;

const SingleVacancyDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //
  const { id } = await params;
  const user = await getProfile();

  const [vacancy, resumes, interview, application] = await Promise.all([
    prisma.vacancy.findUnique({
      where: { id: id },
      include: {
        company: true,
      },
    }),
    prisma.resume.findMany({
      where: { AND: { user_id: user.id, available: true } },
    }),
    prisma.interview.findFirst({
      where: {
        AND: {
          application: { user_id: user.id },
          vacancy_id: id,
        },
      },
    }),
    prisma.vacancy_applications.findFirst({
      where: {
        user_id: user.id,
        vacancy_id: id,
      },
    }),
  ]);

  if (!vacancy) return notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-5 flex-wrap mb-5">
        <PageTitle title={"Vacancy"} description={vacancy.title} />
        {!application ? (
          <InstantApply userID={user.id} resumes={resumes} vacancyID={id} />
        ) : (
          <Button variant={"destructive"}>Already Applied</Button>
        )}
      </div>
      <Separator />
      <div className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-5">
              <Building2Icon
                color="black"
                size={50}
                className="p-2.5 bg-primary rounded-lg"
              />
              <div>
                <h1 className="font-bold text-xl">{vacancy.company.name}</h1>
                <h6 className="text-xs">@{vacancy.company.address}</h6>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <Label>Position</Label>
                <Input value={vacancy.title} />
              </div>
              <div>
                <Label>Date Added</Label>
                <Input
                  value={moment(vacancy.created_at).format("DD MMMM, YYYY")}
                />
              </div>

              {vacancy.remote && (
                <div className="flex items-center gap-4 my-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <Label>Salary</Label>
                  <div className="mt-2">
                    <h6 className="font-bold underline underline-offset-4">
                      {vacancy.monthly_salary
                        ? `R${vacancy.monthly_salary} / Month`
                        : "No Specified Salary"}
                    </h6>
                  </div>
                </div>
                <div>
                  <Label>Available Positions</Label>
                  <div className="mt-2">
                    <h6 className="font-bold underline underline-offset-4">
                      {vacancy.slots
                        ? vacancy.slots === "1"
                          ? "1 Person Needed"
                          : `${vacancy.slots} People Needed`
                        : "Not Specified"}
                    </h6>
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <div className="mt-2">
                    <h6 className="font-bold underline underline-offset-4">
                      {vacancy.location ? vacancy.location : "Not Specified"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Label className="mb-3">Description</Label>
                <Card className="p-3 mt-3">
                  <p className="text-sm">{vacancy.description}</p>
                </Card>
              </div>
            </div>
          </section>
          <section>
            {interview && (
              <Card className="mb-5 rounded-none">
                <div className="bg-emerald-700 p-2 text-center text-white">
                  Interview
                </div>
                <div className="px-4 my-4 flex flex-col w-full gap-4">
                  <div>
                    <Label>Interview Type</Label>
                    <Input value={interview?.type} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      value={moment(interview?.date).format("MMMM DD, YYYY")}
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
                        value={interview.location ? interview.location : "-"}
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
              </Card>
            )}
            <Card>
              <div className="flex h-full py-10 px-4 items-center justify-center flex-col gap-4">
                <Image
                  alt="work"
                  src={"/images/work.png"}
                  height={120}
                  width={160}
                />
                <div>
                  <h1 className="text-lg font-bold text-center">
                    {!application
                      ? "No Application Sent Yet"
                      : "Already Applied"}
                  </h1>
                  <p className="text-xs mt-2 text-center">
                    {!application
                      ? "You can apply for this job."
                      : "Your application for this job has been received and being reviewed."}
                  </p>
                  {application && (
                    <>
                      <div className="mt-4">
                        <Label>Applied On</Label>
                        <Input
                          value={moment(
                            new Date(application.created_at)
                          ).format("DD MMM YYYY")}
                        />
                      </div>
                      <div className="my-4">
                        <Label>Status</Label>
                        <Input value={application.status} />
                      </div>
                      {application.status === "Pending" && (
                        <DeleteApplication id={application.id} />
                      )}
                    </>
                  )}
                </div>
                {!application && (
                  <InstantApply
                    userID={user.id}
                    resumes={resumes}
                    vacancyID={id}
                  />
                )}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default SingleVacancyDetails;
