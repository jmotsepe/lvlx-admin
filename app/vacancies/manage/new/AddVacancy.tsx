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
import { Button, buttonVariants } from "@/components/ui/button";
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
import { vacancy, vacancySchema } from "@/prisma/generated/zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@prisma/client";

const AddVacancy = ({ companies }: { companies: company[] }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<vacancy>({
    resolver: zodResolver(vacancySchema),
  });

  const submit = async (data: vacancy) => {
    setLoading(true);
    const { error } = await supabaseClient.from("vacancy").insert({
      company_id: data.company_id,
      title: data.title,
      description: data.description,
      location: data.location,
      remote: data.remote,
      monthly_salary: data.monthly_salary,
      type: data.type,
      slots: data.slots,
      close_date: data.close_date.toDateString(),
    });
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        router.push("/vacancies/manage");
      });
      toast.success("Vacancy added successfully");
    }
    setLoading(false);
  };

  return (
    <>
      {companies.length === 0 && (
        <div
          className={buttonVariants({
            variant: "destructive",
            className: "w-full mb-6 flex items-center gap-4",
          })}
        >
          <Info />
          <h6>You have no companies you manage</h6>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit, (errors) => console.log(errors))}
          className="space-y-4 py-3"
        >
          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vacancy position"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem className="flex mt-2.5 flex-col w-full">
                  <FormLabel>Select Company</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? companies.find(
                                (company) => company.id === field.value
                              )?.name
                            : "Select company"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-[250px] p-0">
                      <Command>
                        <CommandInput placeholder="Search company..." />
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup className="overflow-y-auto">
                          {companies.map((company) => (
                            <CommandItem
                              value={company.id}
                              key={company.name}
                              onSelect={() => {
                                form.setValue("company_id", company.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing date</FormLabel>
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
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Job location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthly_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Salary</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input
                      disabled={loading}
                      placeholder="How much is the salary?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mt-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is this a remote job?</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Some info about this vacancy"
                    {...field}
                    rows={18}
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
            {loading ? "Loading..." : "Add Vacancy"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddVacancy;
