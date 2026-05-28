import { personal_details } from "@prisma/client";
import React from "react";
import NoData from "../NoData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PersonalDetails = ({ details }: { details: personal_details | null }) => {
  //
  if (!details) return <NoData />;

  return (
    <div className="p-3 mt-10">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Lastname</Label>
          <Input value={details.last_name} />
        </div>
        <div>
          <Label>Firstname</Label>
          <Input value={details.first_name} />
        </div>
        <div>
          <Label>Gender</Label>
          <Input value={details.gender} />
        </div>
        <div>
          <Label>Preferred Language</Label>
          <Input value={details.home_language} />
        </div>
        <div>
          <Label>Country</Label>
          <Input value={details.country} />
        </div>
        {details.address && (
          <div>
            <Label>Address</Label>
            <Input value={details.address} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
