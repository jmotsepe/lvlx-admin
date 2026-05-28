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
  profilesOptionalDefaults,
  profilesOptionalDefaultsSchema,
} from "@/prisma/generated/zod";
import { Card } from "@/components/ui/card";
import { profiles } from "@prisma/client";

const AccountForm = ({
  user,
  profile,
}: {
  user: string;
  profile: profiles;
}) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<profilesOptionalDefaults>({
    // resolver: zodResolver(profilesOptionalDefaultsSchema),
    defaultValues: profile,
  });

  const submit = async (data: profilesOptionalDefaults) => {
    setLoading(true);

    const { error } = await supabaseClient
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        cell_number: data.cell_number,
        province: data.province,
        email: data.email,
      })
      .eq("id", user);

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
    <Card className="p-4">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Communication email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="john@gmail.com"
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
                  <FormLabel>Cell number</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      disabled={loading}
                      placeholder="07123456789"
                      {...field}
                    />
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
                  <Select {...field} onValueChange={field.onChange}>
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
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  {/* @ts-ignore */}
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gauteng">Gauteng</SelectItem>
                      <SelectItem value="Limpopo">Limpopo</SelectItem>
                      <SelectItem value="North West">North West</SelectItem>
                      <SelectItem value="Free State">Free State</SelectItem>
                      <SelectItem value="KwaZulu-Natal">
                        KwaZulu-Natal
                      </SelectItem>
                      <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                      <SelectItem value="Northern Cape">
                        Northern Cape
                      </SelectItem>
                      <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                      <SelectItem value="Western Cape">Western Cape</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="px-20 mt-10 w-full"
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default AccountForm;
