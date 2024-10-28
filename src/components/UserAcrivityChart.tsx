"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format, parseISO } from "date-fns";
import { explorerData } from "@/data/explorerData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const UserActivityLineChart: React.FC = () => {
  // Group transactions by month
  const activityCounts = explorerData.reduce((acc, transaction) => {
    // Extract year and month from the timestamp
    const yearMonth = format(transaction.timestamp, "yyyy-MM");
    acc[yearMonth] = (acc[yearMonth] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for the chart
  const data = {
    labels: Object.keys(activityCounts).map(
      (yearMonth) => format(parseISO(`${yearMonth}-01`), "MMM") // Format as "Jan", "Feb", etc.
    ),
    datasets: [
      {
        label: "Number of Activities",
        data: Object.values(activityCounts), // Y-axis (activity counts)
        fill: false,
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        tension: 0.1, // Smoothness of the line
      },
    ],
  };

  // Define the chart options with proper typing
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "User Activities Over Months",
      },
    },
    scales: {
      x: {
        type: "category", // Use 'category' type since we are formatting the labels ourselves
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Activity Count",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-center font-bold mb-4">User Activity Line Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserActivityLineChart;
