// @ts-ignore
// @ts-expect-error
// @ts-nocheck
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contact_info } from "@prisma/client";
import React from "react";
import NoData from "../NoData";
import { Separator } from "@/components/ui/separator";

const ContactDetails = ({ details }: { details: contact_info | null }) => {
  if (!details) return <NoData />;

  return (
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
              <Input value={details?.next_of_kin_name} />
            </div>
          </div>

          <div>
            <Label>Next Of Kin Cell Number</Label>
            <div className="mt-2">
              <Input value={details?.next_of_kin_cell} />
            </div>
          </div>
          <div>
            <Label>Relationship</Label>
            <div className="mt-2">
              <Input value={details?.next_of_kin_relationship} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
