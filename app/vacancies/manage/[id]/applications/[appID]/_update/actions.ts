import { talentHired } from "@/lib/emails/talentHired";
import { talentInterview } from "@/lib/emails/talentInterview";
import { talentShortlist } from "@/lib/emails/talentShortlist";
import { prisma } from "@/prisma/prisma";
import moment from "moment";

export async function sendHiredEmail({
  youth,
  sponsor,
  position,
}: {
  youth: string;
  sponsor: string;
  position: string;
}) {
  //
  const [company, user] = await Promise.all([
    prisma.company.findUnique({
      where: { id: sponsor },
      include: { company_manager: { include: { user: true } } },
    }),
    prisma.profiles.findUnique({ where: { id: youth } }),
  ]);

  const managers = company?.company_manager || [];

  await Promise.all(
    managers.map(async (c) => {
      await talentHired({
        company: company?.name || "Unknown Company",
        email: c.user?.email || "Unknown Email",
        name: `${user?.last_name || "Unknown Last Name"} ${
          user?.first_name || "Unknown First Name"
        }`,
        role: position,
      });
    })
  );
}

export async function sendInterviewEmail({
  youth,
  sponsor,
  position,
  interview,
}: {
  youth: string;
  sponsor: string;
  position: string;
  interview: string;
}) {
  const [company, user, inter] = await Promise.all([
    prisma.company.findUnique({
      where: { id: sponsor },
      include: { company_manager: { include: { user: true } } },
    }),
    prisma.profiles.findUnique({ where: { id: youth } }),
    prisma.interview.findUnique({ where: { id: interview } }),
  ]);

  if (!company) {
    throw new Error("Company not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!inter) {
    throw new Error("Interview not found");
  }

  const managers = company?.company_manager || [];

  await Promise.all(
    managers.map(async (c) => {
      await talentInterview({
        company: company?.name,
        email: c.user.email,
        name: `${user?.last_name} ${user?.first_name}`,
        role: position,
        date: moment(inter?.date).format("MMM - DDD - YYYY"),
        time: inter?.time,
        type: inter?.type,
      });
    })
  );
}

export async function sendShortlistedEmail({
  youth,
  sponsor,
  position,
}: {
  youth: string;
  sponsor: string;
  position: string;
}) {
  //
  const [company, user] = await Promise.all([
    prisma.company.findUnique({
      where: { id: sponsor },
      include: { company_manager: { include: { user: true } } },
    }),
    prisma.profiles.findUnique({ where: { id: youth } }),
  ]);

  if (!company) {
    throw new Error("Company not found");
  }
  if (!user) {
    throw new Error("User not found");
  }

  const managers = company?.company_manager || [];

  await Promise.all(
    managers.map(async (c) => {
      await talentShortlist({
        company: company.name,
        email: c.user.email,
        name: `${user?.last_name} ${user?.first_name}`,
        role: position,
      });
    })
  );
}
