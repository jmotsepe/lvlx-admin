import PageTitle from "@/components/main/PageTitle";
import React from "react";
import PointTiersTable from "./PointsList";
import { getPointsTiers } from "./actions";
import getProfile from "@/actions/user";

export const revalidate = 0;

const PricingTiers = async () => {
  await getProfile();
  const points = await getPointsTiers();
  return (
    <div>
      <PageTitle
        title="Pricing tiers"
        description="Update the cost of points"
      />
      <br />
      <PointTiersTable pointTiers={points} />
    </div>
  );
};

export default PricingTiers;
