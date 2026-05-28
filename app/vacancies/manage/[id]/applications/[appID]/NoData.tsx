import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const NoData = () => {
  return (
    <Card className="m-5">
      <CardHeader>
        <CardTitle className="font-black">No Data Found</CardTitle>
        <CardDescription>
          There is no data to display for this item
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default NoData;
