"use client";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { inviteOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { useDisclosure } from "@mantine/hooks";
import { UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { company, invite } from "@prisma/client";
import { generateOTP } from "@/lib/utils";
import { sendInvite } from "./actions";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateInvite = ({ companies }: { companies: company[] }) => {
  //
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const otp = generateOTP(6);

  const form = useForm<invite>({
    // resolver: zodResolver(inviteOptionalDefaultsSchema),
    defaultValues: {
      code: otp,
    },
  });

  const submit = async (data: invite) => {
    try {
      setLoading(true);
      await sendInvite(data);
      toast.success("Invite sent successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "User with this email address already exists or has been invited already."
      );
    } finally {
      setLoading(false);
      toggle();
    }
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
            <UserPlus className="mr-4" size={18} /> Invite User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Who is the user being invited"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the company inviting this user." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Enter the user's email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite message</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Textarea
                          disabled={loading}
                          placeholder="Add a message"
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
                  Send Invitation
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateInvite;
