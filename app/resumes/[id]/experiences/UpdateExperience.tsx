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
import { toast } from "react-toastify";
import { supabaseClient } from "@/utils/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import {
  work_experience,
  work_experienceOptionalDefaultsSchema,
} from "@/prisma/generated/zod";

const UpdateExperience = ({ experience }: { experience: work_experience }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const form = useForm<work_experience>({
    // resolver: zodResolver(work_experienceOptionalDefaultsSchema),
    values: experience,
  });

  const submit = async (data: work_experience) => {
    setLoading(true);
    const { error } = await supabaseClient.from("work_experience").upsert({
      ...data,
    });
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        toggle();
        router.refresh();
      });
      toast.success("Work experience updated successfully");
    }
    setLoading(false);
  };

  return (
    <>
      <Sheet
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
        <SheetTrigger>
          <Button onClick={toggle} size={"icon"} variant={"green"}>
            <Edit size={18} />
          </Button>
        </SheetTrigger>
        <SheetContent className="px-0">
          <SheetHeader className="px-2">
            <SheetTitle>Update experience</SheetTitle>
          </SheetHeader>
          <ScrollArea className="px-1 h-[90vh]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit, (errors) =>
                  console.log(errors)
                )}
                className="space-y-4 py-3 px-2"
              >
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Name of company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          disabled={loading}
                          placeholder="Job position/role"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_job"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mt-3">
                      <FormControl>
                        <Checkbox
                          // @ts-ignore
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I still work here</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div
                  className={cn(
                    "grid grid-cols-2 gap-5",
                    form.watch().current_job && "grid-cols-1"
                  )}
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Since When?</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!form.watch().current_job && (
                    <FormField
                      control={form.control}
                      name="date_ended"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Until When?</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
                            <Input type="date" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                {!form.watch().current_job && (
                  <FormField
                    control={form.control}
                    name="reason_for_leaving"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for leaving</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Textarea
                            disabled={loading}
                            placeholder="Why did you stop working there?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  disabled={loading}
                  onClick={() => form.handleSubmit(submit)}
                  className="w-full"
                >
                  {loading ? "Loading..." : "Update Experience"}
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateExperience;
