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
import { interviewOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { useDisclosure } from "@mantine/hooks";
import { Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { interview } from "@prisma/client";
import { sendInterviewEmail } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";

const Interview = ({
  id,
  sponsor,
  position,
  youth,
  vacancy,
}: {
  id: string;
  position: string;
  sponsor: string;
  youth: string;
  vacancy: string;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const form = useForm<interview>({
    // resolver: zodResolver(interviewOptionalDefaultsSchema),
    defaultValues: {
      type: "Online",
      vacancy_id: vacancy,
      application_id: id,
    },
  });

  const submit = async (data: interview) => {
    setLoading(true);
    const { error, data: interview } = await supabaseClient
      .from("interview")
      .upsert({
        ...data,
        application_id: id,
        vacancy_id: vacancy,
        date: data.date.toDateString(),
      })
      .select("*")
      .single();
    if (error) {
      toast.error(error.message);
    } else {
      await Promise.all([
        supabaseClient
          .from("vacancy_applications")
          .update({ status: "Interview" })
          .eq("id", id),
        sendInterviewEmail({
          interview: interview.id,
          position,
          sponsor,
          youth,
        }),
      ]);
      startTransition(() => {
        toggle();
        router.refresh();
      });
      toast.success("Interview added successfully");
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
          <Button onClick={toggle} variant={"green"}>
            <Briefcase className="mr-2" size={18} /> Interview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add interview</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit, (errors) =>
                  console.log(errors)
                )}
                className="space-y-4 py-3"
              >
                <FormField
                  control={form.control}
                  name="application_id"
                  render={({ field }: any) => (
                    <FormItem className="hidden">
                      <FormLabel>Interview Type</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vacancy_id"
                  render={({ field }: any) => (
                    <FormItem className="hidden">
                      <FormLabel>Interview Type</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Interview Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Physical">Physical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          disabled={loading}
                          type="time"
                          placeholder="Interview time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input
                            disabled={loading}
                            type="date"
                            placeholder="Year started"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch().type === "Online" ? (
                    <FormField
                      control={form.control}
                      name="meeting_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interview link</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
                            <Input
                              disabled={loading}
                              placeholder="Meeting link"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interview location</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
                            <Input
                              disabled={loading}
                              placeholder="Meeting location"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview description</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Textarea
                          disabled={loading}
                          placeholder="Some info about this interview"
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
                  loading={loading}
                >
                  {loading ? "Loading..." : "Add Interview"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Interview;
