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

const DeleteResume = ({
  id,
  fullWidth,
}: {
  id: string;
  fullWidth?: boolean;
}) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { error } = await supabaseClient.from("resume").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      startTransition(() => {
        router.refresh();
      });
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn(fullWidth && "w-full")}>
        <Button
          disabled={loading}
          variant={loading ? "outline" : "destructive"}
          className={cn(fullWidth && "w-full")}
        >
          {loading ? <LoaderIcon size={20} /> : <Trash2 size={20} />}{" "}
          {fullWidth && <span className="ml-3">Delete Resume</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            resume and remove your data from our servers.
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

export default DeleteResume;
