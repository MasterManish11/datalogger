"use client";
import React, { useState } from "react";
import { Fragment } from "react";
import internetError from "../../../../public/internetConnectivityError.svg";
import Loader from "@/app/components/Loader";
import ProductionLineChart from "@/app/components/ProductionLineChart";
import ReportTitle from "@/app/components/ReportTitle";
import SaveAsCSVButton from "@/app/components/SaveAsCSVButton";
import SaveAsPDFButton from "@/app/components/SaveAsPDFButton";
import { Tab } from "@headlessui/react";
import Image from "next/image";

const ProductionDetailReport = () => {
  const [answer, setAnswer] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
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

  return (
    <div className="content-container">
      <ReportTitle title={"Production Detail Report"} />
      <form action="" onSubmit={showResult}>
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
              min="2023-12-02" // specify your minimum date
              max="2023-12-20" // specify your maximum date
              required
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
              required

            >
              <option value="" disabled>Select Machine</option>
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
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
              required

            >
              <option value="" disabled >Select Shift</option>
              <option>1</option>
              <option>2</option>
              {/* <option>3</option> */}
              <option>ALL</option>
            </select>
          </div>
          <div>
            <button
              className="w-full p-2 lg:mt-6 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
              type="submit"
            >
              View
            </button>
          </div>
          <div>
            {activeTab === "table" && answer.length > 0 && (
              <SaveAsCSVButton data={answer} />
            )}
          </div>
          <div>
            {activeTab === "table" && answer.length > 0 && (
              <SaveAsPDFButton data={answer} />
            )}
          </div>
        </div>
      </form>

      <div>
        <Tab.Group
          onChange={(index) =>
            setActiveTab(index === 0 ? "table" : "graphical")
          }
        >
          <Tab.List className="space-x-2 py-2">
            <Tab as={Fragment}>
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={`bg-${
                    selected ? "[#1E7E9E]" : "[#1D335A]"
                  } text-white p-1${
                    selected
                      ? " border-2 border-white outline-none rounded"
                      : ""
                  }`}
                >
                  Table View
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={`bg-${
                    selected ? "[#1E7E9E]" : "[#1D335A]"
                  } text-white p-1 ${
                    selected ? "border-2 border-white outline-none rounded" : ""
                  }`}
                >
                  Graphical View
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
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
                            <td
                              colSpan="9"
                              className="py-2 text-center font-bold text-lg text-white"
                            >
                              {errorMessage}
                            </td>
                          </tr>
                        ) : (
                          <>
                            {answer &&
                              answer.map((data, i) => (
                                <React.Fragment key={i}>
                                  <tr className="tableRow">
                                    <th className="pl-2 text-black">
                                      {i == 0 ? 1 : i + 1}
                                    </th>
                                    <td className="text-center text-black py-2 px-2">
                                      {data.DATE}
                                    </td>
                                    <td className="text-center text-black py-2 px-2">
                                      {data.TIME}
                                    </td>
                                    <td className="text-center text-black py-2 px-2">
                                      {data.cavity}
                                    </td>
                                    <td className="text-center text-black py-2 px-2">
                                      {data.mc_status}
                                    </td>
                                    <td className="text-center text-black py-2 px-2">
                                      {data.strokes}
                                    </td>
                                    <td className="text-center text-black py-2 px-2">
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
            </Tab.Panel>
            <Tab.Panel>
              {errorMessage ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={internetError}
                    alt="SVG Image"
                    width={100}
                    height={100}
                  />
                  <p className="text-center font-semibold text-white">
                    {errorMessage}
                  </p>
                </div>
              ) : (
                <ProductionLineChart data={answer} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProductionDetailReport;
