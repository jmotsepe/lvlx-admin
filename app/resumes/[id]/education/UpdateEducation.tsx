"use client";
import React, { startTransition, useState } from "react";
import {
  Form,
  FormControl,
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
import { education_detailsOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { useDisclosure } from "@mantine/hooks";
import { Edit, GraduationCap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { education_details } from "@prisma/client";

const UpdateEducation = ({ education }: { education: education_details }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const form = useForm<education_details>({
    // resolver: zodResolver(education_detailsOptionalDefaultsSchema),
    defaultValues: {
      status: education.status,
      details: education.details,
      title: education.title,
      year_started: education.year_started,
      year_completed: education.year_completed,
    },
    values: education,
  });

  const submit = async (data: education_details) => {
    setLoading(true);
    const { error } = await supabaseClient.from("education_details").upsert({
      ...data,
      id: education.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        toggle();
        router.refresh();
      });
      toast.success("Educational details updated successfully");
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
          <Button onClick={toggle} size={"icon"} variant={"green"}>
            <Edit size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add education</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit, (errors) =>
                  console.log(errors)
                )}
                className="space-y-4 py-3"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Title of the institution"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your education status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="NotCompleted">
                            Not Completed
                          </SelectItem>
                          <SelectItem value="Active">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="year_started"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Started</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input
                            disabled={loading}
                            type="number"
                            placeholder="Year started"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch().status === "Completed" && (
                    <FormField
                      control={form.control}
                      name="year_completed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Completed</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
                            <Input
                              type="number"
                              disabled={loading}
                              placeholder="Year of completion"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="details"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loading}
                  onClick={() => form.handleSubmit(submit)}
                  className="px-20"
                >
                  {loading ? "Loading..." : "Update Education"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateEducation;
