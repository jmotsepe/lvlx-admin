import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCapIcon } from "lucide-react";
import { education_details } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";

const Education = ({ education }: { education: education_details[] }) => {
  return (
    <div className="mt-8">
      <Table>
        <TableCaption>My Educations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Started</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {education?.map((res, index) => {
            return (
              <TableRow key={res.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <div
                    className={buttonVariants({
                      size: "icon",
                    })}
                  >
                    <GraduationCapIcon size={16} />
                  </div>
                  <h6 className="text-base">{res.title}</h6>
                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>
                    {res.status === "Active"
                      ? "In Progress"
                      : res.status === "NotCompleted"
                      ? "Not Completed"
                      : res.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"} className="font-light">
                    ● {res.year_started}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant={"green"}>View Education</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <AlertDialogHeader>
                          <DialogTitle>View education</DialogTitle>

                          <div>
                            <Label>Title</Label>
                            <Input value={res.title} />
                          </div>

                          <div>
                            <Label>Status</Label>
                            <Input value={res.status} />
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <Label>Year Started</Label>
                              {/* @ts-ignore */}
                              <Input value={res.year_started} />
                            </div>

                            {res.status === "Completed" && (
                              <div>
                                <Label>Year Started</Label>
                                {/* @ts-ignore */}
                                <Input value={res.year_completed} />
                              </div>
                            )}
                          </div>

                          <div>
                            <Label>Details</Label>
                            <Input value={res.details} />
                          </div>
                        </AlertDialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Education;
