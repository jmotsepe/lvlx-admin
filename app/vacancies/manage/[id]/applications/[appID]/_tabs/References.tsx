import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { references } from "@prisma/client";
import { User2 } from "lucide-react";
import React from "react";

const References = ({ references }: { references: references[] }) => {
  return (
    <>
      <div className="mt-8">
        <Table>
          <TableCaption>My References</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Cell</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references?.map((res, index) => {
              return (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div
                      className={buttonVariants({
                        size: "icon",
                        variant: "outline",
                      })}
                    >
                      <User2 size={16} />
                    </div>
                    <h6 className="text-base">{res.name}</h6>
                  </TableCell>
                  <TableCell>
                    <h6>{res.institution}</h6>
                  </TableCell>
                  <TableCell>
                    <Badge>● {res.email}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>● {res.cell_number}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default References;
