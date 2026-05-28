"use server";

import { prisma } from "@/prisma/prisma";

// ... existing code ...

export async function validateResume(id: string) {
  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          education_details: true,
          work_experience: true,
          references: true,
        },
      },
      personal_details: true,
      career_objectives: true,
      contact_info: true,
      cover_letter: true,
      education_details: true,
      references: true,
      work_experience: true,
    },
  });

  if (!resume) return false;

  if (resume.type === "File" && resume.url) {
    return true;
  }

  const requiredFields = [
    "name",
    "description",
    "personal_details",
    "career_objectives",
    "contact_info",
  ];

  for (const field of requiredFields) {
    // @ts-expect-error Type of any
    if (!resume[field]) {
      return false;
    }
  }

  // Validate personal details
  const personalDetails = resume.personal_details;
  if (
    !personalDetails?.first_name ||
    !personalDetails?.last_name ||
    !personalDetails?.gender ||
    !personalDetails?.home_language ||
    !personalDetails?.country
  ) {
    return false;
  }

  // Validate education details
  if (!resume.education_details || resume.education_details.length === 0) {
    return false;
  }
  for (const education of resume.education_details) {
    if (!education.title || !education.details || !education.status) {
      return false;
    }
  }

  // Validate work experience
  if (!resume.work_experience || resume.work_experience.length === 0) {
    return false;
  }
  for (const work of resume.work_experience) {
    if (!work.company || !work.position || !work.date) {
      return false;
    }
  }

  // Validate contact info
  const contactInfo = resume.contact_info;
  if (!contactInfo?.email || !contactInfo?.cell_number) {
    return false;
  }

  // Validate career objectives
  const careerObjectives = resume.career_objectives;
  if (!careerObjectives?.objectives) {
    return false;
  }

  // Validate references
  if (!resume.references || resume.references.length === 0) {
    return false;
  }
  for (const reference of resume.references) {
    if (!reference.name || !reference.institution) {
      return false;
    }
  }

  return true; // All validations passed
}
