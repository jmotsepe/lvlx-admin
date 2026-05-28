"use client";
import React, { useState } from "react";
import Link from "next/link";
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
import moment from "moment";
import { faker } from "@faker-js/faker";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const VacancyList = () => {
  const vacancies = Array.from({ length: 40 }, () => ({
    id: faker.string.uuid(),
    position: faker.person.jobTitle(),
    date: faker.date.recent({ days: 30 }),
    availableSpots: faker.number.int({ max: 30, min: 1 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    company: faker.company.name(),
    description: faker.lorem.paragraphs(2, "<br/>\n"),
    pay: faker.number.int({ max: 40000, min: 8000 }),
  }));

  const [view, setView] = useState<"Table" | "Grid">("Table");
  const [type, setType] = useState<"Temporary" | "Contract" | "Permanent">(
    "Contract"
  );

  return (
    <>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          value={view}
          defaultValue={view}
          onValueChange={(e: any) => setView(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Change view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Table">Table View</SelectItem>
            <SelectItem value="Grid">Grid View</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          defaultValue={type}
          onValueChange={(e: any) => setType(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Permanent">Permanent Job</SelectItem>
            <SelectItem value="Temporary">Temporary Job</SelectItem>
            <SelectItem value="Contract">Contract Job</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Search for job" />
        <Button variant={"green"} className="w-full">
          Search
        </Button>
      </div>
      {view === "Grid" ? (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vacancies.map((job) => {
            return (
              <Card key={job.id}>
                <CardContent>
                  <CardHeader>
                    <CardTitle className="text-md mb-4">
                      <div>
                        <h1 className="mb-1 text-lg line-clamp-1">
                          {job.position}
                        </h1>
                        <div className="flex items-center gap-3">
                          <Link
                            href="/"
                            className="text-xs font-normal underline"
                          >
                            @{job.company}
                          </Link>
                          <span>-</span>
                          <Badge variant={"outline"} className="text-xs">
                            {moment(job.date).fromNow()}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="mt-4">
                        R{job.pay.toFixed(2)} / Month
                      </Badge>
                    </CardTitle>

                    <CardDescription className="line-clamp-2 mt-4">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="grid grid-cols-2 gap-4">
                    <Button variant={"outline"}>Instant Apply</Button>
                    <Button variant={"secondary"}>View Vacancy</Button>
                  </CardFooter>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Table className="mt-7">
          <TableCaption>All Vacancies</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Available Spots</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacancies?.map((company, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="capitalize">
                    {company.position}
                  </TableCell>
                  <TableCell className="text-sm">{company.location}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant={"secondary"}>
                      {company.availableSpots} Spots
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {moment(company.date).fromNow()}
                  </TableCell>

                  <TableCell className="items-center justify-end flex gap-3">
                    <Link
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                      href={`/companies/${company.id}`}
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default VacancyList;
