"use client";
import { Button } from "@/components/ui/button";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { startTransition, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { sendShortlistedEmail } from "./actions";

const ShortList = ({
  id,
  sponsor,
  position,
  youth,
}: {
  id: string;
  position: string;
  sponsor: string;
  youth: string;
}) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vacancy_applications")
      .update({ status: "ShortListed" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      await sendShortlistedEmail({ position, sponsor, youth });
      startTransition(() => {
        router.refresh();
      });
      toast.success("Application shortlisted successfully");
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button loading={loading} size={"sm"}>
          Shortlist
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will notify the applicant that they have been short listed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShortList;
