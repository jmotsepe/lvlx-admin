"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Talent } from "./page";
import { Card, CardContent } from "@/components/ui/card";
import getInitials from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/main/Loading";
import { toast } from "react-toastify";
import { getTalents } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

const TalentFormSchema = z.object({
  province: z.string(),
  search: z.string().optional(),
});

export type TalentForm = z.infer<typeof TalentFormSchema>;

const Search = ({ initialTalent }: { initialTalent: Talent[] }) => {
  //
  const [loading, setLoading] = useState(false);
  const [talents, setTalents] = useState<Talent[]>(initialTalent);
  const form = useForm<TalentForm>({
    // resolver: zodResolver(TalentFormSchema),
  });

  useEffect(() => {
    setTalents(initialTalent);
  }, [initialTalent]);

  const searchUsers = async (form: TalentForm) => {
    if (!form.search) {
      toast.error("Please enter a search term");
      return;
    }
    setLoading(true);
    try {
      const talents = await getTalents(form);
      setTalents(talents);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(searchUsers, (errors) =>
            console.log(errors)
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 mb-3">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E.g. Software Engineer, Painter, etc..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
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
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="my-4" />

      {loading ? (
        <Loading />
      ) : (
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5">
          {talents.map((res) => {
            const fullname = `${res.user.first_name} ${res.user.last_name}`;
            const initials = getInitials(fullname);

            const stats = res._count;
            return (
              <Card key={res.id}>
                <CardContent className="py-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="font-bold line-clamp-1">{fullname}</h1>
                        <p className="text-xs text-muted-foreground">
                          {res.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="my-8 space-y-4">
                    <h6 className="line-clamp-1 text-sm font-medium">
                      {res.name}
                    </h6>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="text-xs bg-emerald-600 text-white">
                        {stats.work_experience} Work Experience
                      </Badge>
                      <Badge className="text-xs ">
                        {stats.education_details} Education
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/talents/${res.id}`}
                      className={buttonVariants({
                        variant: "secondary",
                        className: "w-full",
                      })}
                    >
                      View User
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Search;
