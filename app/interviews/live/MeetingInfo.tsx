"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import Meeting from "./Meeting";
import { profilesOptionalDefaults } from "@/prisma/generated/zod";
import {
  Briefcase,
  Building2Icon,
  Calendar,
  Clock,
  CreditCard,
  Info,
  ListFilter,
  LocateIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import moment from "moment";
import {
  company,
  interview,
  vacancy,
  vacancy_applications,
} from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import CustomMeeting from "./CustomMeeting";
import Link from "next/link";
import Image from "next/image";

const MeetingInfo = ({
  meetingID,
  user,
  interview,
}: {
  user: profilesOptionalDefaults;
  meetingID: string;
  interview: interview & {
    vacancy: vacancy & { company: company };
    application: vacancy_applications;
  };
}) => {
  const [ready, setReady] = useState(false);
  const combinedMoment = moment(interview.date);

  // Extract hours and minutes from the time string
  // @ts-ignore
  const [hours, minutes] = interview?.time.split(":").map(Number);

  // Set the hours and minutes to the parsed date
  combinedMoment.hour(hours).minute(minutes);

  return (
    <div className="min-h-screen">
      {ready ? (
        <CustomMeeting id={meetingID} name={user.first_name} />
      ) : (
        <div className="mx-auto max-w-lg py-10 px-4">
          <Card className="border p-6 text-gray-900 bg-white">
            <Image src="/lvlx-light.png" height={50} width={50} alt="logo" />
            <h1 className="font-bold capitalize text-2xl mb-1">
              interview waiting room.
            </h1>
            <p className="text-xs">
              If you are not the host of this, you will need to wait for the
              host to start the meeting.
            </p>
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 mb-10">
                <Building2Icon
                  color="black"
                  size={45}
                  className="p-2.5 bg-primary rounded-lg"
                />
                <div>
                  <h1 className="font-bold text-lg">
                    {interview.vacancy.company.name}
                  </h1>
                  <h6 className="text-xs">
                    @{interview.vacancy.company.address}
                  </h6>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Calendar color="orange" size={18} /> Date
                </div>
                <Input
                  className="bg-white  ring-0 focus-visible:ring-0 focus-visible:border-0"
                  value={moment(interview.date).format("DD MMM YYYY")}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Clock color="orange" size={18} /> Time
                </div>
                <Input
                  // @ts-ignore
                  value={interview?.time || ""}
                  className="bg-white  ring-0 focus-visible:ring-0 focus-visible:border-0"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ListFilter color="orange" size={18} /> Type
                </div>
                <Input
                  className="bg-white  ring-0 focus-visible:ring-0 focus-visible:border-0"
                  value={interview.type}
                />
              </div>

              {interview.type === "Physical" ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <LocateIcon color="orange" size={18} /> Location
                  </div>
                  <Input
                    //   @ts-ignore
                    value={interview?.location}
                  />
                </div>
              ) : null}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Briefcase color="orange" size={18} /> Position
                </div>
                <Input
                  className="bg-white  ring-0 focus-visible:ring-0 focus-visible:border-0"
                  value={interview.vacancy.title}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CreditCard color="orange" size={18} /> Salary
                </div>
                <Input
                  className="bg-white  ring-0 focus-visible:ring-0 focus-visible:border-0"
                  value={
                    interview.vacancy.monthly_salary
                      ? `R${interview.vacancy.monthly_salary}`
                      : "Not Specified"
                  }
                />
              </div>
            </div>
            <div className="mt-10 grid md:grid-cols-2 gap-5">
              {interview.type === "Online" ? (
                <button
                  className="bg-black text-white w-full py-3 text-sm rounded-md"
                  onClick={() => setReady(true)}
                >
                  Prepare Interview Screen
                </button>
              ) : null}
              <Link
                href="/dashboard"
                className="bg-red-500 text-center text-white w-full py-3 text-sm rounded-md"
              >
                Leave Interview
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MeetingInfo;
