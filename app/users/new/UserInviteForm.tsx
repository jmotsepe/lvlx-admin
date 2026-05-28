"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/utils";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendInvite } from "./actions";
import { CompanyWithPoints } from "./page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserInviteForm = ({ companies }: { companies: CompanyWithPoints[] }) => {
  //
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const submit = async () => {
    const validMail = validateEmail(email);
    if (!validMail) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    toast.promise(
      sendInvite({
        email,
        company,
      }),
      {
        error: "Something went wrong, please try again later",
        pending: "Sending out invite...",
        success: `Invitation sent to ${email}`,
      }
    );
    setLoading(false);
  };

  return (
    <CardContent className="border mt-5 p-4 max-w-xl space-y-4">
      <Select value={company} onValueChange={(e) => setCompany(e)}>
        <SelectTrigger>
          <SelectValue placeholder="Company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name} - {c.points?.balance || 0} points
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        disabled={loading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button loading={loading} onClick={submit}>
        Send Invitation
      </Button>
    </CardContent>
  );
};

export default UserInviteForm;
