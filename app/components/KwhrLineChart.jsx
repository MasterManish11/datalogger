"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);
const KwhrLineChart = ({ data }) => {
  const [lineGraphData, setLineGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: "Time vs Kwhr",
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    if (data.length > 0) {
      const labels = data.map((d) => d.TIME);
      const kwhrData = data.map((d) => d.kwhr);

      setLineGraphData({
        labels,
        datasets: [
          {
            label: "Date vs Production",
            data: kwhrData,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
            pointRadius: 3,
            pointBackgroundColor: "red",
          },
        ],
      });
    }
  }, [data]);

  const options = {
    scales: {
      x: {
        type: "category",
        labels: lineGraphData.labels,
        title: {
          display: true,
          text: "Time", // X-axis label
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kwhr", // Y-axis label
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const date = lineGraphData.labels[dataIndex];
            const production = lineGraphData.datasets[0].data[dataIndex];
            return `Date: ${date}, Production: ${production}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="sm:w-2/3 sm:mx-auto w-full">
      <h1>Production vs Time</h1>
      <Line data={lineGraphData} options={options} />
    </div>
  );
};

export default KwhrLineChart;
