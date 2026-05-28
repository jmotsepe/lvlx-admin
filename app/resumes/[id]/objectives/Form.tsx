"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/utils/supabase/client";
import { career_objectives } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ObjectivesForm = ({
  id,
  objectives,
}: {
  id: string;
  objectives: career_objectives | null;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>("");

  useEffect(() => {
    setValue(objectives?.objectives);
  }, [objectives]);

  async function submit() {
    if (!value) {
      toast.error("Please enter some objectives");
      return;
    } else {
      setLoading(true);

      const { data, error: fetchError } = await supabaseClient
        .from("career_objectives")
        .select("*")
        .eq("resume_id", id)
        .single();

      let error = null;
      if (data) {
        // Update existing record
        const { error: updateError } = await supabaseClient
          .from("career_objectives")
          .update({ objectives: value })
          .eq("resume_id", id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabaseClient
          .from("career_objectives")
          .insert({ resume_id: id, objectives: value });
        error = insertError;
      }
      if (error) {
        toast.error(error.message);
      } else {
        startTransition(() => {
          router.refresh();
        });
        toast.success("Career objectives updated");
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
        placeholder="What would you like to archive in your career?"
      />
      <Button onClick={submit} disabled={loading || !value}>
        Update Objectives
      </Button>
    </div>
  );
};

export default ObjectivesForm;
