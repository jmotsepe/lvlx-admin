import React from "react";
import PageTitle from "@/components/main/PageTitle";
import AdminDashboard from "./admin";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import CompanyDashboard from "./company";
import YouthDashboard from "./youth";
import SponsorDashboard from "./sponsor";

export const revalidate = 0;

const Dashboard = async () => {
  const user = await getProfile();

  return (
    <>
      <PageTitle title="Dashboard" description="Overview and analytics" />
      <div className="mt-8">
        {user.role === "Admin" && <AdminDashboard />}
        {user.role === "Employer" && <CompanyDashboard userID={user.id} />}
        {user.role === "Youth" && <YouthDashboard userID={user.id} />}
        {user.role === "Sponsor" && <SponsorDashboard />}
      </div>
    </>
  );
};

export default Dashboard;
