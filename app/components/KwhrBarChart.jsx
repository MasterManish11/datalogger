"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto";
const KwhrBarChart = ({data}) => {
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
              value > 100 ? "green" : "red"
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
        },
      },
      y: {
        title: {
          display: true,
          text: "Kwhr", // Y-axis label
        },
      },
    },
  };

  return (
    <div>
      {graphdata.labels?.length > 0 ? (
        <div className="sm:w-2/3 sm:mx-auto w-full">
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
