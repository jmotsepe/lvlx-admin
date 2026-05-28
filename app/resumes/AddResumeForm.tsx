"use client";
import React, { startTransition, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  resumeOptionalDefaults,
  resumeOptionalDefaultsSchema,
} from "@/prisma/generated/zod";
import { useDisclosure } from "@mantine/hooks";
import { Textarea } from "@/components/ui/textarea";

const AddResumeForm = () => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const defaultValues: Partial<resumeOptionalDefaults> = {
    type: "Custom",
  };

  const form = useForm<resumeOptionalDefaults>({
    // resolver: zodResolver(resumeOptionalDefaultsSchema),
    defaultValues,
  });

  const submit = async (data: resumeOptionalDefaults) => {
    setLoading(true);
    const { error } = await supabaseClient.from("resume").upsert({
      name: data.name,
      description: data.description,
      type: data.type,
    });
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        toggle();
        router.refresh();
      });
      toast.success("New resume added successfully");
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={
          loading
            ? undefined
            : () => {
                toggle();
                form.reset();
              }
        }
        defaultOpen={open}
      >
        <DialogTrigger>
          <Button onClick={toggle}>Add Resume</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new resume</DialogTitle>
            <DialogDescription>
              Each resume can be managed, updated and reviewed by our team.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit, (errors) =>
                  console.log(errors)
                )}
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
                          placeholder="Used to identify this resume"
                          {...field}
                        />
                      </FormControl>

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
                        <Input
                          disabled={loading}
                          placeholder="Some info about this resume"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Resume Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your resume type" />
                          </SelectTrigger>
                        </FormControl>
                        <FormDescription>
                          File based resumes allows to upload a PDF version of
                          your resume. Custom resumes are created within LVLX.
                        </FormDescription>
                        <SelectContent>
                          <SelectItem value="File">File</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loading}
                  onClick={() => form.handleSubmit(submit)}
                  className="px-20"
                >
                  {loading ? "Creating Resume" : "Proceed"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddResumeForm;
