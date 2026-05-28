import getProfile from "@/actions/user";
import PageTitle from "@/components/main/PageTitle";
import { prisma } from "@/prisma/prisma";
import moment from "moment";
import { redirect } from "next/navigation";
import React from "react";
import RejectApplication from "../RejectApplication";
import ShortList from "./_update/ShortList";
import { Button } from "@/components/ui/button";
import Interview from "./_update/Interview";
import Hire from "./_update/Hire";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDetails from "./_tabs/PersonalDetails";
import ContactDetails from "./_tabs/ContactDetails";
import Education from "./_tabs/Education";
import Experience from "./_tabs/Experience";
import References from "./_tabs/References";
import CoverLetter from "./_tabs/CoverLetter";
import Objectives from "./_tabs/Objectives";
import { Label } from "@/components/ui/label";
import { Building2Icon, Computer } from "lucide-react";
import { Input } from "@/components/ui/input";

export const revalidate = 0;

const ViewApplication = async ({
  params,
}: {
  params: Promise<{ appID: string; id: string }>;
}) => {
  const { appID, id } = await params;

  const [application, user] = await Promise.all([
    prisma.vacancy_applications.findUnique({
      where: { id: appID, status: { not: "Rejected" } },
      include: {
        resume: {
          include: {
            career_objectives: true,
            contact_info: true,
            cover_letter: true,
            education_details: true,
            personal_details: true,
            references: true,
            user: true,
            work_experience: true,
          },
        },
        vacancy: {
          include: { company: true },
        },
      },
    }),
    getProfile(),
  ]);

  if (!application || !user) redirect(`/vacancies/manage/${id}/applications`);

  const vacancy = application.vacancy;
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <PageTitle
          title={"View Application"}
          description={`Sent by ${application.resume.user.first_name} ${
            application.resume.user.last_name
          } ${moment(application.created_at).fromNow()}`}
          goBack
        />
        {user.role === "Employer" && (
          <div className="flex items-center gap-4 flex-wrap">
            {application.status !== "Hired" &&
              application.status !== "Interview" && (
                <RejectApplication id={application.id} />
              )}
            {application.status === "Pending" && (
              <ShortList
                id={application.id}
                position={vacancy.title}
                sponsor={vacancy.company_id}
                youth={application.user_id}
              />
            )}
            {application.status === "ShortListed" && (
              <Interview
                id={application.id}
                vacancy={application.vacancy_id}
                position={vacancy.title}
                sponsor={vacancy.company_id}
                youth={application.user_id}
              />
            )}
            {application.status === "Interview" && (
              <div className="flex items-center gap-3 flex-wrap">
                <RejectApplication id={application.id} />
                <Hire
                  id={application.id}
                  position={vacancy.title}
                  sponsor={vacancy.company_id}
                  youth={application.user_id}
                />
              </div>
            )}
            {application.status === "Hired" && (
              <Button variant={"green"}>Hired 🎉🎉</Button>
            )}
          </div>
        )}
      </div>
      <Separator className="my-5" />

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
            <Input value={moment(vacancy.created_at).format("DD MMMM, YYYY")} />
          </div>
        </div>
      </section>
      <div className="mt-10">
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="education">Education Details</TabsTrigger>
            <TabsTrigger value="experience">Work Experience</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="objectives">Career Objectives</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <PersonalDetails details={application.resume.personal_details} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactDetails details={application.resume.contact_info} />
          </TabsContent>
          <TabsContent value="education">
            <Education education={application.resume.education_details} />
          </TabsContent>
          <TabsContent value="experience">
            <Experience experiences={application.resume.work_experience} />
          </TabsContent>
          <TabsContent value="references">
            <References references={application.resume.references} />
          </TabsContent>
          <TabsContent value="cover-letter">
            <CoverLetter letter={application.resume.cover_letter} />
          </TabsContent>
          <TabsContent value="objectives">
            <Objectives letter={application.resume.career_objectives} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewApplication;
