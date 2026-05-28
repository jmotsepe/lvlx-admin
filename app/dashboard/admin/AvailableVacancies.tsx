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
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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
      text: "Vacancies By Company",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels: Array.from({ length: 6 }, () => faker.company.name()),
  datasets: [
    {
      label: "Months",
      data: Array.from({ length: 6 }, () =>
        faker.number.int({ min: 1, max: 10 })
      ),
      borderColor: "cyan",
      backgroundColor: "cyan",
    },
  ],
};

export default function AvailableVacancies() {
  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
}
