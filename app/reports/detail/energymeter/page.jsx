"use client";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Loader from "@/app/components/Loader";
import KwhrLineChart from "@/app/components/KwhrLineChart";
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
    <div className="content-container">
      <div className="py-1">
        <h1 className="report-title">EnergyMeter Detail Report</h1>
      </div>
      <div className="grid lg:grid-cols-6 lg:gap-4 py-2 grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="date"
            className="sm:font-semibold font-medium sm:text-base text-sm"
          >
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
          <label
            htmlFor="energymeter"
            className="sm:font-semibold font-medium sm:text-base text-sm"
          >
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
            <option defaultValue>Select Meter</option>
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shift"
            className="sm:font-semibold font-medium sm:text-base text-sm"
          >
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
            <option defaultValue>Select Shift</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>ALL</option>
          </select>
        </div>
        <div>
          <button
            className="w-full lg:mt-6 p-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded font-semibold text-black"
            onClick={showResult}
          >
            View
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
        <Tabs>
          <TabList>
            <Tab>Table View</Tab>
            <Tab>Graphical view</Tab>
          </TabList>
          <TabPanel>
            <div className="tableParent">
              <table className="tableContainer" id="table">
                <thead className="thead">
                  <tr>
                    <th>No</th>
                    <th scope="col" className="py-3 text-center px-2">
                      Date
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      Time
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      Current
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      Frequency
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      KW
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      KWhr
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      pf
                    </th>
                    <th scope="col" className="py-3 text-center px-2">
                      voltage
                    </th>
                  </tr>
                </thead>
                <tbody className="h-48 overflow-y-auto">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="py-2 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {answer &&
                        answer.map((data, i) => (
                          <React.Fragment key={i}>
                            <tr className="tableRow">
                              <th>{i == 0 ? 1 : i + 1}</th>
                              <td className="py-2 text-center px-2">{data.DATE}</td>
                              <td className="py-2 text-center px-2">{data.TIME}</td>
                              <td className="py-2 text-center px-2">
                                {data.current}
                              </td>
                              <td className="py-2 text-center px-2">{data.freq}</td>
                              <td className="py-2 text-center px-2">{data.kw}</td>
                              <td className="py-2 text-center px-2">{data.kwhr}</td>
                              <td className="py-2 text-center px-2">{data.pf}</td>
                              <td className="py-2 text-center px-2">
                                {data.voltage}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel>
            <KwhrLineChart data={answer} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default EnergyDetailReport;
