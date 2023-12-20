"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Loader from "@/app/components/Loader";
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const EnergyDetailReport = () => {
  const [answer, setAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    date: "",
    energymeter: "",
    shift: "",
  });

  const inputEvent = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

 
  const showResult = async (event) => {
    try {
      // Prevent the default form submission behavior
      setLoading(true);
      event.preventDefault();

      // Define the API endpoint
      const apiUrl = "/api/detail/energymeter";

      // Prepare the request options
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }), // Assuming `data` is defined elsewhere
      };

      // Make the API request
      const response = await fetch(apiUrl, requestOptions);
      setLoading(false);
      // Check if the request was successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      // Parse the JSON response
      const responseData = await response.json();

      // Update state with the response data
      setAnswer(responseData);
    } catch (error) {
      // Handle errors, e.g., log them or show an error message to the user
      console.error("Error in showResult:", error);
    }
  };

  const saveData = () => {
    const pdf = new jsPDF();
    pdf.autoTable({ html: "#table" });
    pdf.save("data.pdf");
  };

  const saveAsCSV = () => {
    const csv = generateCsv(csvConfig)(answer);
    download(csvConfig)(csv);
  };

  return (
    <div className="content-container py-3 rounded">
      <div className="py-1">
        <h1 className="report-title">EnergyMeter Detail Report</h1>
      </div>
      <div className="grid lg:grid-cols-6 lg:gap-4 py-2 grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="font-semibold">
            {" "}
            Select date
          </label>

          <input
            type="date"
            name="date"
            id="date"
            className="w-full rounded p-1 border-2 border-gray-100 lg:text-base text-sm"
            onChange={inputEvent}
            value={data.date}
          />
        </div>
        <div>
          <label htmlFor="energymeter" className="font-semibold">
            {" "}
            Select Meter
          </label>

          <select
            className="w-full rounded p-1 py-[0.4rem] border-2 border-gray-100 lg:text-base text-sm"
            name="energymeter"
            id="energymeter"
            onChange={inputEvent}
            value={data.energymeter}
          >
            <option selected className="">
              Select Meter
            </option>
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div>
          <label htmlFor="shift" className="font-semibold">
            {" "}
            Select Shift
          </label>

          <select
            className="w-full rounded p-1 py-[0.4rem] border-2 border-gray-100 lg:text-base text-sm"
            name="shift"
            id="shift"
            onChange={inputEvent}
            value={data.shift}
          >
            <option selected>Select Shift</option>
            <option>All</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
        <div>
          <button
            className="w-full lg:mt-6 p-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded font-semibold text-black"
            onClick={showResult}
          >
            Show Result
          </button>
        </div>
        <div>
          <button
            className="w-full lg:mt-6 p-2 bg-green-400 rounded font-semibold text-black"
            onClick={saveAsCSV}
          >
            Save AS CSV
          </button>
        </div>
        <div>
          <button
            className="w-full lg:mt-6 p-2 bg-purple-400 rounded font-semibold text-black"
            onClick={saveData}
          >
            Save AS PDF
          </button>
        </div>
      </div>
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:h-96 h-[484px] overflow-y-auto">
          <table
            className="w-full min-w-full border-collapse text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            id="table"
          >
            <thead className="sticky top-0 z-10 text-xs text-gray-50 uppercase bg-blue-600 dark:bg-gray-700 dark:text-gray-400">
              <tr className="">
                <th></th>
                <th scope="col" className="py-3 text-center">
                  Date
                </th>
                <th scope="col" className="py-3 text-center">
                  Time
                </th>
                <th scope="col" className="py-3 text-center">
                  Current
                </th>
                <th scope="col" className="py-3 text-center">
                  Frequency
                </th>
                <th scope="col" className="py-3 text-center">
                  KW
                </th>
                <th scope="col" className="py-3 text-center">
                  KWhr
                </th>
                <th scope="col" className="py-3 text-center">
                  pf
                </th>
                <th scope="col" className="py-3 text-center">
                  voltage
                </th>
              </tr>
            </thead>
            <tbody className="h-48 overflow-y-auto">
              {loading ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  {answer &&
                    answer.map((data, i) => (
                      <>
                        <tr
                          key={i}
                          className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 "
                        >
                          <th>{i == 0 ? 1 : i + 1}</th>
                          <td className="py-2 text-center">{data.DATE}</td>
                          <td className="py-2 text-center">{data.TIME}</td>
                          <td className="py-2 text-center">{data.current}</td>
                          <td className="py-2 text-center">{data.freq}</td>
                          <td className="py-2 text-center">{data.kw}</td>
                          <td className="py-2 text-center">{data.kwhr}</td>
                          <td className="py-2 text-center">{data.pf}</td>
                          <td className="py-2 text-center">{data.voltage}</td>
                        </tr>
                      </>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergyDetailReport;
