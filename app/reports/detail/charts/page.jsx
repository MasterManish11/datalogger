'use client';
import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Charts =  () => {
  const [chartData, setChartData] = useState([]);

  const showChart = async (event) => {
    try {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Define the API endpoint
      const apiUrl = "/api/production/charts/detailchart";

      // Prepare the request options
      const requestOptions = {
        //   method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //   body: JSON.stringify({ data }), // Assuming `data` is defined elsewhere
      };

      // Make the API request
      const response = await fetch(apiUrl, requestOptions);

      // Check if the request was successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      // Parse the JSON response
      const responseData = await response.json();

      // Update state with the response data
      // setAnswer(responseData);
      // console.log("responseData",responseData)

      //     //   setChartData({
      //     //     options: {
      //     //       chart: {
      //     //         id: "basic-bar",
      //     //         type: "line",
      //     //         animations:{
      //     //         enabled: false,
      //     //         height: responseData.length * 10,
      //     //         }
      //     //       },
      //     //       xaxis: {
      //     //         categories: responseData.map((data) => data.TIME),
      //     //         // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      //     //       },
      //     //     //   yaxis:{
      //     //     //     labels :{
      //     //     //         minWidth: 0,
      //     //     //         maxWidth: 160,
      //     //     //     }
      //     //     //   }
      //     //     },
      //     //     markers:{
      //     //         size:0,
      //     //     },
      //     //     series: [
      //     //       {
      //     //         //  type: 'category',
      //     //         name: "series-1",
      //     //         data: responseData.map((data) => data.production),
      //     //         // data: [30, 40, 45, 50, 49, 60, 70, 91]
      //     //       },

      //     //     ],
      //     //   });
      setChartData({
        labels : responseData.map((data)=>data.TIME),
        // labels: [],
        datasets: [
          {
            label: "Production",
            data: responseData.map((data)=>data.production),
            backgroundColor: ["blue"],
            // borderWidth : 1,
            // borderColor: 'rgb(75, 192, 192)',
            // tension: 0.1
            fill: false
          },
        ],
        option :{
          responsive: true
        }
      });
    } catch (error) {
      // Handle errors, e.g., log them or show an error message to the user
      console.error("Error in showResult:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Detail Charts</h1>
      <button onClick={showChart} className="p-1 bg-indigo-400 rounded">
        Show Chart
      </button>
      {chartData.labels?.length > 0 ? (
        <div className="w-1/2">
          <Line data={chartData}  className="w-full max-h-96"/>
        </div>
      ) : (
        <>
          <h1></h1>
        </>
      )}
    </div>
  );
};

export default Charts;
