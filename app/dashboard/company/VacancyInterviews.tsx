"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarGraphsData } from ".";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VacancyInterviews = ({ interviews }: { interviews: BarGraphsData }) => {
  const options = {
    indexAxis: "x" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vacancy Interviews",
      },
    },
  };

  const data = {
    labels: interviews.map((app) => app.title),
    datasets: [
      {
        label: "Count",
        data: interviews.map((app) => app._count.interview),
        borderColor: "rgb(10, 100, 100)",
        backgroundColor: "rgba(10, 100, 100, 0.5)",
      },
    ],
  };

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
};

export default VacancyInterviews;
