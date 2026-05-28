"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  profiles,
  profilesOptionalDefaultsSchema,
} from "@/prisma/generated/zod";
import { supabaseClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@mantine/hooks";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UpdateUser = ({ profile }: { profile: profiles }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const form = useForm<profiles>({
    // resolver: zodResolver(profilesOptionalDefaultsSchema),
    mode: "all",
    defaultValues: profile,
  });

  async function onSubmit(data: profiles) {
    setLoading(true);

    const { error } = await supabaseClient
      .from("profiles")
      .upsert({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        cell_number: data.cell_number,
        role: data.role,
        status: data.status,
        gender: data.gender,
        province: data.province,
      })
      .select("*");
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User updated successfully");
      startTransition(() => {
        router.refresh();
      });
    }
    setLoading(false);
  }

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
            <SheetTitle>Update user</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[90vh]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) =>
                  console.log(errors)
                )}
                className="space-y-4 py-3 px-4"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>User role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Youth">Youth</SelectItem>
                          <SelectItem value="Sponsor">Sponsor</SelectItem>
                          <SelectItem value="Employer">Employer</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firstname</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Firstname"
                            {...field}
                          />
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
                        <FormLabel>Lastname</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input
                            disabled={loading}
                            placeholder="Lastname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={loading} {...field} />
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
                        <Input disabled={loading} {...field} />
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
                          <SelectItem value="Eastern Cape">
                            Eastern Cape
                          </SelectItem>
                          <SelectItem value="Western Cape">
                            Western Cape
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loading}
                  onClick={() => form.handleSubmit(onSubmit)}
                  className="w-full mt-3"
                >
                  Update User
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateUser;
