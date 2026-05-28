"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabaseClient } from "@/utils/supabase/client";
import { useDisclosure } from "@mantine/hooks";
import { resume } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FC, startTransition, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  vacancyID: string;
  userID: string;
  resumes: resume[];
}

const InstantApply: FC<Props> = ({ vacancyID, userID, resumes }) => {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();
  const router = useRouter();

  async function applyVacancy() {
    setLoading(true);
    const { error, data } = await supabaseClient
      .from("vacancy_applications")
      .insert({
        resume_id: resume,
        vacancy_id: vacancyID,
        user_id: userID,
      });

    if (error) {
      toast.error(error.message);
      toggle();
    } else {
      startTransition(() => {
        router.refresh();
      });

      toggle();
      toast.success("You have successfully applied for this vacancy");
    }
    setLoading(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        loading
          ? undefined
          : () => {
              toggle();
            }
      }
      defaultOpen={open}
    >
      <DialogTrigger asChild>
        <Button disabled={loading} className="w-full sm:w-auto">
          Instant Apply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for vacancy</DialogTitle>
          <DialogDescription>
            Select a resume to instantly apply for this vacancy
          </DialogDescription>
        </DialogHeader>
        <div className="my-5">
          <Select onValueChange={(e) => setResume(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a resume to use" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((res) => (
                <SelectItem key={res.id} value={res.id}>
                  {res.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={applyVacancy} type="submit" loading={loading}>
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstantApply;
