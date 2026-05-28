"use client";
import { Button } from "@/components/ui/button";
import { Check, LoaderIcon, Trash2 } from "lucide-react";
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
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ApproveVacancy = ({ id }: { id: string }) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vacancy")
      .update({ status: "Approved" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Vacancy approved successfully");
    }
    setLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button loading={loading} disabled={loading} size="icon">
          {loading ? <LoaderIcon size={20} /> : <Check size={20} />}{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Approving a vacancy will make it available to Youth and allows them
            to submit applications.
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

export default ApproveVacancy;
