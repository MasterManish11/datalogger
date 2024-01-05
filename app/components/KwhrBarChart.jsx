"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto";
const KwhrBarChart = ({ data }) => {
  const [graphdata, setGraphData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const labelsWithoutLast = data.map((data) => data.date).slice(0, -1);
      const dataWithoutLast = data.map((data) => data.kwhr).slice(0, -1);
      setGraphData({
        labels: labelsWithoutLast,
        datasets: [
          {
            label: "Date vs Kwhr",
            data: dataWithoutLast,
            backgroundColor: dataWithoutLast.map((value) =>
              value > 100 ? "#67E8F9" : "#3D9394"
            ),
          },
        ],
      });
    }
  }, [data]);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // X-axis label
          color: "white",
        },
        ticks: {
          color: "white", // Change the color of x-axis ticks
        },
      },
      y: {
        title: {
          display: true,
          text: "Kwhr", // Y-axis label
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
    },
  };
  return (
    <div>
      {graphdata.labels?.length > 0 ? (
        <div className="sm:w-[50%] sm:mx-auto w-full">
          <h1 className="text-white">Date vs Energy</h1>
          <Bar data={graphdata} options={options} />
        </div>
      ) : (
        <>
          <h1>graphdata</h1>
        </>
      )}
    </div>
  );
};

export default KwhrBarChart;
