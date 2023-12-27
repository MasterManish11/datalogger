"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto";
const ProductionBarchart = ({ data }) => {
  const [graphdata, setGraphData] = useState([]);
  const [effChartData, setEffChartData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const labelsWithoutLast = data.map((data) => data.date).slice(0, -1);
      const dataWithoutLast = data.map((data) => data.production).slice(0, -1);
      setGraphData({
        labels: labelsWithoutLast,
        datasets: [
          {
            label: "Date vs Production",
            data: dataWithoutLast,
            backgroundColor: dataWithoutLast.map((value) =>
              value > 1000 ? "green" : "red"
            ),
          },
        ],
      });
      const eff = data.map((data) => data.efficiency);
      const avgEfficiency = eff[eff.length - 1];

      setEffChartData({
        labels: ["Efficiency", "Remaining"],
        datasets: [
          {
            data: [avgEfficiency, 100 - avgEfficiency],
            backgroundColor: ["#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {graphdata.labels?.length > 0 ? (
        <div className="w-full grid sm:grid-cols-3 sm:gap-4 grid-cols-1">
          <div className="sm:col-span-2 ">
            <Bar data={graphdata} />
          </div>
          <div className="flex flex-col items-center">
            <div className="sm:w-full w-1/2">
              <h2 className="text-center font-semibold ">Machine Efficiency</h2>
              <Pie data={effChartData} className="sm:w-1/2 w-1/4" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1>graphdata</h1>
        </>
      )}
    </div>
  );
};

export default ProductionBarchart;
