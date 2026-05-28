"use client";
import { payment_settings } from "@prisma/client";
import React, { FC, startTransition, useState } from "react";
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
import { toast } from "react-toastify";
import { supabaseClient } from "@/utils/supabase/client";
import {
  payment_settingsOptionalDefaults,
  payment_settingsOptionalDefaultsSchema,
} from "@/prisma/generated/zod";
import { useRouter } from "next/navigation";

type Props = {
  settings: payment_settings | null;
};

const UpdatePaymentSettings: FC<Props> = ({ settings }) => {
  //
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const defaultValues: Partial<payment_settingsOptionalDefaults> = {
    candidate_cost: settings?.candidate_cost,
    interview_cost: settings?.interview_cost,
    search_cost: settings?.search_cost,
    vacancy_cost: settings?.vacancy_cost,
  };

  const form = useForm<payment_settings>({
    // resolver: zodResolver(payment_settingsOptionalDefaultsSchema),
    defaultValues,
  });

  const submit = async (form: payment_settings) => {
    setLoading(true);
    if (settings) {
      const { error } = await supabaseClient
        .from("payment_settings")
        .update({
          search_cost: form.search_cost,
          vacancy_cost: form.vacancy_cost,
          candidate_cost: form.candidate_cost,
          interview_cost: form.interview_cost,
          invite_cost: form.invite_cost,
        })
        .match({ id: settings.id });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Payment settings updated successfully");
      }
    } else {
      const { error } = await supabaseClient.from("payment_settings").insert({
        search_cost: form.search_cost,
        vacancy_cost: form.vacancy_cost,
        candidate_cost: form.candidate_cost,
        interview_cost: form.interview_cost,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Payment settings updated successfully");
      }
    }
    startTransition(() => {
      router.refresh();
    });

    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit, (e) => console.log(e))}
          className="space-y-10 py-3"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="search_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points does it cost to search for a candidate per
                    search?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vacancy_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vacancy cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points to deduct when a client posts a vacancy?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invite_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points to deduct when inviting a user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="candidate_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate view</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points to deduct when a client views a candidate
                    profile?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interview_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview view</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many points to deduct when a candidate is sent to be
                    interviewed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            loading={loading}
            className="px-20"
          >
            Update Settings
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdatePaymentSettings;
