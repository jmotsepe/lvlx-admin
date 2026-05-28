"use client";
import React, { startTransition, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/utils/supabase/client";
import {
  resume,
  resumeOptionalDefaults,
  resumeSchema,
} from "@/prisma/generated/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToggle } from "@mantine/hooks";

//
const UpdateResume = ({
  resume,
  valid,
}: {
  resume: resume;
  valid: boolean;
}) => {
  //
  const [loading, setLoading] = useState(false);
  const [myResume, setMyResume] = useState(resume);
  const [open, toggle] = useToggle();
  const router = useRouter();

  const defaultValues: Partial<resumeOptionalDefaults> = {
    ...myResume,
  };

  useEffect(() => {
    setMyResume(resume);
  }, [resume]);

  const form = useForm<resume>({
    // resolver: zodResolver(resumeSchema),
    defaultValues,
    values: myResume,
  });

  const submit = async (form: resume) => {
    setLoading(true);
    const { error, data } = await supabaseClient
      .from("resume")
      .update({
        name: form.name,
        description: form.description,
        available: form.available,
      })
      .eq("id", myResume.id)
      .select();

    if (error) {
      toast.error(error.message);
    } else {
      const newResume = {
        ...data[0],
        created_at: new Date(data[0].created_at),
      };
      startTransition(() => {
        setMyResume(newResume);
        router.refresh();
      });
      toast.success("Resume updated successfully");
    }
    toggle();
    setLoading(false);
  };

  return (
    <div>
      <Dialog
        open={loading === false ? open : loading}
        onOpenChange={() => {
          form.reset();
          open && toggle();
        }}
      >
        <DialogTrigger>
          <Button onClick={() => toggle()}>Update Resume</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update your resume</DialogTitle>
            <DialogDescription>
              Each resume can be reviewed by our team to help you land a job.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit, (e) => console.log(e))}
                className="space-y-4 py-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Your name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A title used to identify this resume.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Some info about this resume"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A description used to identify this resume.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {valid && (
                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish resume</FormLabel>
                          <FormDescription>
                            Once your resume is published, it can be discovered
                            by recruiters and used to apply for vacancies.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <Button disabled={loading} type="submit" className="px-20">
                  {loading ? "Updating Resume" : "Update"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateResume;
