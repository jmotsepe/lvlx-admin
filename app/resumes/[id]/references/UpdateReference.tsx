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
import { referencesOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { useDisclosure } from "@mantine/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { references } from "@prisma/client";

const UpdateReference = ({ reference }: { reference: references }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();

  const form = useForm<references>({
    // resolver: zodResolver(referencesOptionalDefaultsSchema),
    values: reference,
  });

  const submit = async (data: references) => {
    setLoading(true);
    const { error } = await supabaseClient.from("references").upsert({
      ...data,
    });
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        toggle();
        router.refresh();
      });
      toast.success("Reference updated successfully");
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
          <Button onClick={toggle} variant={"secondary"}>
            Update
          </Button>
        </SheetTrigger>
        <SheetContent className="px-0">
          <SheetHeader className="px-2">
            <SheetTitle>Update Reference</SheetTitle>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full names</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Names of the referenced person"
                          {...field}
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          disabled={loading}
                          placeholder="Contact email"
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
                          placeholder="Contact cell number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution/Work Place</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  onClick={() => form.handleSubmit(submit)}
                  className="w-full"
                >
                  {loading ? "Loading..." : "Add Reference"}
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateReference;
