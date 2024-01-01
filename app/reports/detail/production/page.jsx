"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Loader from "@/app/components/Loader";
import ProductionLineChart from "@/app/components/ProductionLineChart";
import { Tabs } from "flowbite-react";

const csvConfig = mkConfig({ useKeysAsHeaders: true });

const ProductionDetailReport = () => {
  const [answer, setAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [data, setData] = useState({
    date: "",
    energymeter: "",
    shift: "",
  });

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const showResult = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);

      const apiUrl = "/api/detail/production";

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

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      // Parse the JSON response
      const responseData = await response.json();

      if (responseData.message) {
        setErrorMessage(responseData.message);
        setAnswer([]);
      } else {
        setAnswer(responseData);
        setErrorMessage(null);
      }

      setLoading(false);
    } catch (error) {
      // Handle errors, e.g., log them or show an error message to the user
      console.log("Error in showResult:", error);
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
        <h1 className="report-title">Production Detail Report</h1>
      </div>
      <div className="grid lg:grid-cols-6 lg:gap-4 py-2 grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="sm:font-semibold font-medium sm:text-base text-sm text-white"
          >
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
        <div className="flex flex-col">
          <label
            htmlFor="energymeter"
            className="sm:font-semibold font-medium sm:text-base text-sm text-white"
          >
            Select Machine
          </label>
          <select
            className="w-full rounded p-1 py-[0.4rem] border-2 border-gray-100 lg:text-base text-sm"
            name="energymeter"
            id="energymeter"
            onChange={inputEvent}
            value={data.energymeter}
          >
            <option defaultValue>Select Machine</option>
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="shift"
            className="sm:font-semibold font-medium sm:text-base text-sm text-white"
          >
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
            className="w-full p-2 lg:mt-6 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
            onClick={showResult}
          >
            View
          </button>
        </div>
        <div>
          <button
            className="w-full p-2 lg:mt-6 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
            onClick={saveAsCSV}
          >
            Save AS CSV
          </button>
        </div>
        <div>
          <button
            className="w-full p-2 lg:mt-6 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
            onClick={saveData}
          >
            Save AS PDF
          </button>
        </div>
      </div>
      <div>
        <Tabs aria-label="Pills" style="pills">
          <Tabs.Item active title="Table view">
            <div className="tableParent">
              <table className="tableContainer" id="table">
                <thead className="thead">
                  <tr>
                    <th className="pl-2">No</th>
                    <th scope="col" className="text-center py-3 px-2">
                      Date
                    </th>
                    <th scope="col" className="text-center py-3 px-2">
                      Time
                    </th>
                    <th scope="col" className="text-center py-3 px-2">
                      Cavity
                    </th>
                    <th scope="col" className="text-center py-3 px-2">
                      M/C Status
                    </th>
                    <th scope="col" className="text-center py-3 px-2">
                      Strokes
                    </th>
                    <th scope="col" className="text-center py-3 px-2">
                      Production
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
                      {errorMessage ? (
                        <tr>
                          <td colSpan="9" className="py-2 text-center">
                            {errorMessage}
                          </td>
                        </tr>
                      ) : (
                        <>
                          {answer &&
                            answer.map((data, i) => (
                              <React.Fragment key={i}>
                                <tr className="tableRow">
                                  <th className="pl-2">{i == 0 ? 1 : i + 1}</th>
                                  <td className="text-center py-2 px-2">
                                    {data.DATE}
                                  </td>
                                  <td className="text-center py-2 px-2">
                                    {data.TIME}
                                  </td>
                                  <td className="text-center py-2 px-2">
                                    {data.cavity}
                                  </td>
                                  <td className="text-center py-2 px-2">
                                    {data.mc_status}
                                  </td>
                                  <td className="text-center py-2 px-2">
                                    {data.strokes}
                                  </td>
                                  <td className="text-center py-2 px-2">
                                    {data.production}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Graphical View" className="custom-tab">
            {errorMessage ? (
              <div>
                <p className="text-center">{errorMessage}</p>
              </div>
            ) : (
              <ProductionLineChart data={answer} />
            )}
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductionDetailReport;
