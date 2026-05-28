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

const DeleteApplication = ({ id }: { id: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vacancy_applications")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Job application removed successfully...");
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={"w-full"}>
        <Button
          disabled={loading}
          variant={loading ? "outline" : "destructive"}
          className={"w-full"}
          loading={loading}
        >
          Withdraw Application
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your job
            application and remove your data from our servers.
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

export default DeleteApplication;
