import getProfile from "@/actions/user";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";
import Meeting from "./Meeting";
import MeetingInfo from "./MeetingInfo";
import Script from "next/script";

export const revalidate = 0;

const Interview = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string; appId: string }>;
}) => {
  const { id, appId } = await searchParams;

  const user = await getProfile();

  const validateMeeting = async () => {
    if (user.role === "Youth") {
      const interview = await prisma.interview.findFirst({
        where: {
          AND: [
            {
              id,
            },
            {
              application: {
                user_id: id,
              },
            },
          ],
        },
        include: {
          vacancy: { include: { company: true } },
          application: true,
        },
      });

      if (!interview) {
        return redirect("/dashboard");
      }

      return interview;
    } else {
      const interview = await prisma.interview.findFirst({
        where: {
          vacancy: {
            company: {
              company_manager: {
                some: {
                  user_id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
          id: id,
        },
        include: {
          vacancy: { include: { company: true } },
          application: true,
        },
      });

      if (!interview) {
        return redirect("/dashboard");
      }

      return interview;
    }
  };

  const meeting = await validateMeeting();

  if (!meeting) redirect("/dashboard");

  async function createRoom() {
    const url = `https://api.videosdk.live/v2/rooms`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          customRoomId: id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.VIDEOSDK_TOKEN!,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Could not create room:", error);
    }
  }

  const data = await createRoom();
  if (!data) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-linear-to-tr from-orange-700 to-yellow-700">
      <MeetingInfo interview={meeting} user={user} meetingID={data?.roomId} />
    </div>
  );
};

export default Interview;
