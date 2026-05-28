"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cover_letter } from "@/prisma/generated/zod";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CoverLetterForm = ({
  id,
  coverLetter,
}: {
  id: string;
  coverLetter: cover_letter | null;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>("");

  useEffect(() => {
    setValue(coverLetter?.letter);
  }, [coverLetter]);

  async function submit() {
    if (!value) {
      toast.error("Please add something to your motivational letter");
      return;
    } else {
      setLoading(true);
      const { error } = await supabaseClient.from("cover_letter").insert({
        resume_id: id,
        letter: value,
      });
      if (error) {
        toast.error(error.message);
      } else {
        startTransition(() => {
          router.refresh();
        });
        toast.success("Motivational letter updated");
      }
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-7">
      <Textarea
        value={value}
        rows={10}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Generate your motivational letter"
      />
      <Button onClick={submit} disabled={loading || !value}>
        Update Motivational letter
      </Button>
    </div>
  );
};

export default CoverLetterForm;
