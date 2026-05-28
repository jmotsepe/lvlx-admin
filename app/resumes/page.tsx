import PageTitle from "@/components/main/PageTitle";
import { Separator } from "@/components/ui/separator";
import React from "react";
import AddResumeForm from "./AddResumeForm";
import { buttonVariants } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Link from "next/link";
import DeleteResume from "./DeleteResume";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

const Resumes = async () => {
  //

  const profile = await getProfile();

  if (profile.role !== "Youth") redirect("/dashboard");

  const resumes = await prisma.resume.findMany({
    where: { user_id: profile.id },
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: {
          vacancy_applications: true,
        },
      },
    },
  });

  //
  return (
    <>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <PageTitle
          title="My Resumes"
          description="Manage all your resumes in one place."
        />
        <AddResumeForm />
      </div>

      <Separator className="my-4" />

      {resumes.length === 0 ? (
        <div />
      ) : (
        <>
          {/* <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5">
            {resumes.map((res) => {
              return (
                <Card key={res.id}>
                  <CardContent className="py-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={buttonVariants({
                            size: "icon",
                          })}
                        >
                          <Paperclip size={20} />
                        </div>
                        <Badge
                          className={cn(
                            "bg-red-500 hover:bg-red-600 text-white",
                            res.available && "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          {res.available ? "Published" : "Unpublished"}
                        </Badge>
                      </div>
                    </div>
                    <div className="my-4 space-y-2">
                      <Badge variant={"outline"} className="text-xs">
                        ● {moment(res.created_at).fromNow()}
                      </Badge>
                      <h6 className="line-clamp-1 font-bold">{res.name}</h6>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/resumes/${res.id}`}
                        className={buttonVariants({
                          className: "grow",
                          variant: "secondary",
                        })}
                      >
                        View Resume
                      </Link>
                      <DeleteResume id={res.id} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div> */}

          <div className="overflow-x-auto ">
            <Table>
              <TableCaption>My Resumes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Applications</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes?.map((res, index) => {
                  return (
                    <TableRow key={res.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        <div
                          className={buttonVariants({
                            size: "icon",
                          })}
                        >
                          <Paperclip size={20} />
                        </div>
                        <h6 className="text-base whitespace-nowrap">
                          {res.name}
                        </h6>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "bg-red-500 hover:bg-red-600 font-light text-white",
                            res.available && "bg-green-600 hover:bg-green-700"
                          )}
                        >
                          {res.available ? "Published" : "Unpublished"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {res._count.vacancy_applications} Applications
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={"outline"} className="font-light">
                          ● {moment(res.created_at).fromNow()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/resumes/${res.id}`}
                            className={buttonVariants({
                              variant: "secondary",
                            })}
                          >
                            View Resume
                          </Link>
                          <DeleteResume id={res.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
};

export default Resumes;
