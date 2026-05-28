import getProfile from "@/actions/user";
import PageTitle from "@/components/main/PageTitle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getInitials from "@/lib/utils";
import { prisma } from "@/prisma/prisma";
import moment from "moment";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ApproveCompany from "./ApproveCompany";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import RejectCompany from "./RejectCompany";
import { Building, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { handleDownloadClick } from "@/lib/handleDownloadClick";
import DownloadCert from "./DownloadCert";

export const revalidate = 0;

const PendingCompanies = async () => {
  const profile = await getProfile();

  if (!profile) redirect("/auth/get-started");

  if (profile?.role !== "Admin") redirect("/dashboard");

  const companies = await prisma.company.findMany({
    include: {
      user: true,
    },
    where: {
      status: "Pending",
    },
  });

  return (
    <>
      <PageTitle
        title="Unverified Companies"
        description="Approve or reject all pending companies"
        goBack
      />
      <Table className="mt-10">
        <TableCaption>Pending Companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company, index) => {
            const fullName = `${company.user.last_name} ${company.user.first_name}`;
            const initials = getInitials(fullName);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="capitalize font-bold">
                  {company.name}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h6 className="font-bold">{fullName}</h6>
                      <span className="text-xs font-light text-foreground">
                        Joined {moment(company.user.created_at).fromNow()}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  <Badge variant={"secondary"}>{company.department}</Badge>
                </TableCell>

                <TableCell className="text-xs">
                  <Badge>{moment(company.created_at).fromNow()}</Badge>
                </TableCell>

                <TableCell className="items-center justify-end flex gap-3">
                  <Sheet>
                    <SheetTrigger>
                      <Button>View</Button>
                    </SheetTrigger>
                    <SheetContent className="md:w-[600px]" side={"right"}>
                      <SheetHeader>
                        <SheetTitle className="mb-8">
                          <div className="flex items-center gap-5">
                            <Button size="icon">
                              <Building />
                            </Button>
                            <div>
                              <h1>{company.name}</h1>
                              <h6 className="text-sm text-muted-foreground">
                                {company.department}
                              </h6>
                            </div>
                          </div>
                        </SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-full">
                        <div className="space-y-4 mb-8">
                          {company.regCertificate ? (
                            <DownloadCert url={company.regCertificate} />
                          ) : (
                            <Card className="px-3 py-5 flex justify-center flex-col items-center">
                              <File />
                              <h1 className="font-bold text-center">
                                No Certificate Uploaded
                              </h1>
                              <p className="text-xs text-muted-foreground text-center">
                                Do not approve companies that do not have a
                                valid certificate.
                              </p>
                            </Card>
                          )}
                          <div>
                            <Label>Company Type</Label>
                            <Input value={company.type} />
                          </div>
                          <div>
                            <Label>Registration No</Label>
                            <Input value={company.reg_no} />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Input value={company.address} />
                          </div>
                          <div>
                            <Label>Employees</Label>
                            <Input value={company.employees} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 mb-20">
                          <ApproveCompany id={company.id} />
                          <RejectCompany id={company.id} />
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default PendingCompanies;
