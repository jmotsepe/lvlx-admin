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
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const DeleteVacancy = ({ id }: { id: string }) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient
      .from("vacancy")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
      });
      toast.success("Vacancy deleted successfully");
    }
    setLoading(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button disabled={loading} variant={"destructive"} loading={loading}>
          Delete Vacancy
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            vacancy and remove your data from our servers.
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

export default DeleteVacancy;
