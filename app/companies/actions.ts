"use server";

import getProfile from "@/actions/user";
import { companyOptionalDefaults } from "@/prisma/generated/zod";
import { prisma } from "@/prisma/prisma";
import crypto from "crypto";

export async function addNewCompany(data: companyOptionalDefaults) {
  const user = await getProfile();
  if (!user) throw new Error("Unable to create company");

  try {
    const company = await prisma.company.create({
      data: {
        address: data.address,
        department: data.department,
        description: data.description,
        employees: data.employees,
        name: data.name,
        reg_no: data.reg_no,
        type: data.type,
        company_manager: {
          create: {
            user_id: user.id,
          },
        },
        points: {
          create: {
            balance: 0,
          },
        },
        regCertificate: data.regCertificate,
        user_id: user.id,
        status: "Pending",
      },
    });

    return company;
  } catch (error) {
    throw new Error("Unable to create a new company");
  }
}

export async function getPaymentToken(company: string) {
  const user = await getProfile();

  if (!user) {
    throw new Error("User is missing");
  }

  // Check if a token already exists for the user and company
  let UTK = await prisma.token.findFirst({
    where: {
      user_id: user.id,
      company_id: company,
      used: false,
    },
  });

  if (!UTK) {
    // Generate a new token if none exists
    const token = crypto.randomBytes(32).toString("hex");

    // Store the new token in the database
    UTK = await prisma.token.create({
      data: {
        token,
        user_id: user.id,
        company_id: company,
        used: false,
      },
    });
  }

  return UTK.token;
}
