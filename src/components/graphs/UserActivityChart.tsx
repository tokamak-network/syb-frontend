"use client";

import React, { useRef } from "react";
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
  ScriptableContext,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
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

export const UserActivityLineChart: React.FC = () => {
  const chartRef = useRef(null);

  const activityCounts = explorerData.reduce((acc, transaction) => {
    const yearMonth = format(transaction.timestamp, "yyyy-MM");
    acc[yearMonth] = (acc[yearMonth] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const userCounts: Record<string, number> = {
    "2024-01": 1,
    "2024-02": 2,
    "2024-03": 3,
    "2024-04": 2,
    "2024-05": 5,
    "2024-06": 2,
  };

  const labels = Object.keys(activityCounts).map((yearMonth) =>
    format(new Date(yearMonth + "-01"), "MMM")
  );

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Number of Activities",
        data: Object.values(activityCounts),
        borderColor: "#36A2EB",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return undefined;
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(54, 162, 235, 0.4)");
          gradient.addColorStop(1, "rgba(54, 162, 235, 0)");

          return gradient;
        },
        tension: 0.4,
        fill: true,
      },
      {
        label: "Number of Users",
        data: labels.map((label) => userCounts[label] || 0),
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "User Activities and User Counts Over Months",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const currentValue = tooltipItem.raw as number;
            let percentageChange = "";

            if (tooltipItem.datasetIndex === 0) {
              // Activity dataset
              const previousValue =
                tooltipItem.dataIndex > 0
                  ? (data.datasets[0].data[tooltipItem.dataIndex - 1] as number)
                  : 0;
              percentageChange = previousValue
                ? ` (${(
                    ((currentValue - previousValue) / previousValue) *
                    100
                  ).toFixed(2)}%)`
                : "";
            }

            return `${datasetLabel}: ${currentValue}${percentageChange}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => value as string,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4">
      <div className="relative h-full">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};
