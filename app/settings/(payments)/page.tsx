import { prisma } from "@/prisma/prisma";
import React from "react";
import UpdatePaymentSettings from "./UpdatePaymentSettings";
import PageTitle from "@/components/main/PageTitle";
import getProfile from "@/actions/user";

export const revalidate = 0;

const PaymentsSettingsPage = async () => {
  //
  await getProfile();
  const paymentSettings = await prisma.payment_settings.findFirst();

  return (
    <div>
      <PageTitle
        title="Payment Settings"
        description="Update the cost of points and points deductions"
      />
      <br />
      <UpdatePaymentSettings settings={paymentSettings} />
    </div>
  );
};

export default PaymentsSettingsPage;
