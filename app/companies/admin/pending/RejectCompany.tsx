"use client";
import { Button } from "@/components/ui/button";
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

const RejectCompany = ({ id }: { id: string }) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient
      .from("company")
      .update({ status: "Rejected" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Company rejected successfully");
    }
    setLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          className="w-full"
          loading={loading}
          variant={loading ? "outline" : "destructive"}
        >
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Rejecting a company will have it unavailable to Youth and they will
            not be able to submit job applications and more.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submit}>Reject</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectCompany;
