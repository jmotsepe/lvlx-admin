import getProfile from "@/actions/user";
import NoData from "@/app/vacancies/manage/[id]/applications/[appID]/NoData";
import PageTitle from "@/components/main/PageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 0;

const ContactInfo = async ({ params }: { params: Promise<{ id: string }> }) => {
  //
  const { id } = await params;
  await getProfile();
  const details = await prisma.contact_info.findUnique({
    where: { resume_id: id },
  });

  if (!details) return <NoData />;

  return (
    <div>
      <PageTitle title="Contact Details" />
      <div className="max-w-3xl">
        <div className="space-y-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div>
              <Label>Email Address</Label>
              <div className="mt-2">
                <Input value={details.email} />
              </div>
            </div>

            <div>
              <Label>Cell number</Label>
              <div className="mt-2">
                <Input value={details.cell_number} />
              </div>
            </div>

            <div>
              <Label>Alternative Cell Number</Label>
              <div className="mt-2">
                {/* @ts-ignore */}
                <Input value={details?.tel_number} />
              </div>
            </div>
          </div>
          <h1 className="font-bold">Next Of Kin</h1>
          <Separator />
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div>
              <Label>Next of kin</Label>
              <div className="mt-2">
                {/* @ts-ignore */}

                <Input value={details?.next_of_kin_name} />
              </div>
            </div>

            <div>
              <Label>Next Of Kin Cell Number</Label>
              <div className="mt-2">
                {/* @ts-ignore */}

                <Input value={details?.next_of_kin_cell} />
              </div>
            </div>
            <div>
              <Label>Relationship</Label>
              <div className="mt-2">
                {/* @ts-ignore */}
                <Input value={details?.next_of_kin_relationship} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
