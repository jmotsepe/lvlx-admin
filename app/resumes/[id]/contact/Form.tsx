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
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { contact_infoOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { contact_info } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

const ContactInfoForm = ({
  id,
  contactInfo,
}: {
  id: string;
  contactInfo: contact_info | null;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<contact_info>({
    // resolver: zodResolver(contact_infoOptionalDefaultsSchema),
    defaultValues: contactInfo || undefined,
  });

  const submit = async (data: contact_info) => {
    setLoading(true);
    const { error } = await supabaseClient.from("contact_info").upsert({
      ...data,
      resume_id: id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Personal details updated successfully");
      startTransition(() => {
        router.refresh();
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={loading}
                      placeholder="john@doe.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cell_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cell Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      disabled={loading}
                      placeholder="0734567890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tel_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Cell Number</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      type="tel"
                      disabled={loading}
                      placeholder="07987654321"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h1 className="font-bold">Next Of Kin</h1>
          <Separator />
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <FormField
              control={form.control}
              name="next_of_kin_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of kin</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      disabled={loading}
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_of_kin_cell"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Of Kin Cell Number</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}

                    <Input
                      type="tel"
                      disabled={loading}
                      placeholder="0123456789"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_of_kin_relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      type="tel"
                      disabled={loading}
                      placeholder="Relationship with next of kin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit" className="px-20 mt-10">
            {loading ? "Updating..." : "Update Contact Details"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactInfoForm;
