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
import { languages } from "@/lib/constants/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  personal_details,
  personal_detailsOptionalDefaultsSchema,
} from "@/prisma/generated/zod";
import { countries } from "@/lib/constants/countries";

const PersonalDetailsForm = ({
  id,
  personalData,
}: {
  id: string;
  personalData: personal_details | null;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<personal_details>({
    // resolver: zodResolver(personal_detailsOptionalDefaultsSchema),
    defaultValues: personalData || undefined,
  });

  const submit = async (data: personal_details) => {
    setLoading(true);
    const { error } = await supabaseClient.from("personal_details").upsert({
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

  console.log("LANGS", languages);

  return (
    <div className="max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Jon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="home_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-52 overflow-y-auto h-52">
                      {languages.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      disabled={loading}
                      placeholder="Sandton"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-52 overflow-y-auto h-52">
                      {countries.map((l) => (
                        <SelectItem key={l.name} value={l.name}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit" className="px-20 mt-10">
            {loading ? "Updating..." : "Update Personal Details"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PersonalDetailsForm;
