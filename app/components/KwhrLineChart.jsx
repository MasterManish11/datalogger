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
            label: "Time vs Energy",
            data: kwhrData,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
            pointRadius: 3,
            pointBackgroundColor: "red",
            // color:'white'
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
          color: "white",
        },
        ticks: {
          color: "white", // Change the color of x-axis ticks
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "kwhr", // Y-axis label
          color: "white",
        },
        ticks: {
          color: "white", // Change the color of x-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white", // Set the desired color for the dataset label text
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const date = lineGraphData.labels[dataIndex];
            const Energy = lineGraphData.datasets[0].data[dataIndex];
            return `Date: ${date}, Energy: ${Energy}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="md:w-[50%] md:mx-auto w-full">
      <h1 className="text-white">Time vs Energy</h1>
      <Line data={lineGraphData} options={options} />
    </div>
  );
};

export default KwhrLineChart;
