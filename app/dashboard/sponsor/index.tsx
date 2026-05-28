import React from "react";
import Stats from "./Stats";
import Companies from "./Companies";
import { Card } from "@/components/ui/card";

const SponsorDashboard = () => {
  return (
    <>
      <Stats />
      <Card className="mt-5 pb-5">
        <Companies />
      </Card>
    </>
  );
};

export default SponsorDashboard;
