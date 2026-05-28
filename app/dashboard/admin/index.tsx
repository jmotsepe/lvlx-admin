import React, { Suspense } from "react";
import Stats from "./Stats";
import WeeklySales from "./WeeklySales";
import AvailableVacancies from "./AvailableVacancies";
import RecentSales from "./RecentSales";
import RecentJobs from "./RecentJobs";
import { prisma } from "@/prisma/prisma";

const AdminDashboard = async () => {
  //
  async function getWeeklyTotals(): Promise<{ day: string; total: number }[]> {
    //
    const totalsByDay: { [day: number]: number } = {};

    const today = new Date();

    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );

    // Initialize totalsByDay object with all days set to zero
    for (let i = 0; i < 7; i++) {
      totalsByDay[i] = 0;
    }

    const queryResult = await prisma.transactions.groupBy({
      by: "created_at",
      _sum: { amount: true },
      where: {
        created_at: {
          gte: lastWeek,
          lt: today,
        },
      },
    });

    for (const row of queryResult) {
      const transactionDate = new Date(row.created_at);
      const dayIndex = transactionDate.getDay();
      const sum = row._sum?.amount || 0;

      totalsByDay[dayIndex] += sum;
    }

    const result: { day: string; total: number }[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayName = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (7 - dayIndex)
      ).toLocaleString("default", {
        weekday: "long",
      });
      const total = totalsByDay[dayIndex];

      result.push({ day: dayName, total });
    }

    return result;
  }

  const [weeklySales] = await Promise.all([getWeeklyTotals()]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-10">
        <Suspense>
          <Stats />
        </Suspense>
        <Suspense>
          <WeeklySales weeklySales={weeklySales} />
        </Suspense>
        <Suspense>
          <RecentSales />
        </Suspense>
        <Suspense>
          <RecentJobs />
        </Suspense>
        <Suspense>
          <AvailableVacancies />
        </Suspense>
      </div>
    </>
  );
};

export default AdminDashboard;
