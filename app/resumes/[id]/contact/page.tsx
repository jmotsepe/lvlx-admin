import PageTitle from "@/components/main/PageTitle";
import React from "react";
import ContactInfoForm from "./Form";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const ContactPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const data = await prisma.contact_info.findFirst({
    where: { resume_id: id },
  });

  return (
    <div>
      <PageTitle
        title="Contact Info"
        description="Update your resume's contact information"
      />
      <div className="my-8">
        <ContactInfoForm id={id} contactInfo={data} />
      </div>
    </div>
  );
};

export default ContactPage;
