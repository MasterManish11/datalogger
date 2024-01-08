"use client";
import React, { useState } from "react";
import { Fragment } from "react";
import Loader from "@/app/components/Loader";
import KwhrLineChart from "@/app/components/KwhrLineChart";
import internetError from "../../../../public/internetConnectivityError.svg";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import ReportTitle from "@/app/components/ReportTitle";
import SaveAsCSVButton from "@/app/components/SaveAsCSVButton";
import SaveAsPDFButton from "@/app/components/SaveAsPDFButton";

const EnergyDetailReport = () => {
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
    event.preventDefault();
    try {
      setLoading(true);

      // Define the API endpoint
      const apiUrl = "/api/detail/energymeter";

      // Prepare the request options
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
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
      console.error("Error in showResult:", error);
    }
  };

  return (
    <div className="content-container">
      <ReportTitle title={"EnergyMeter Detail Report"} />
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
              Select Meter
            </label>

            <select
              className="w-full rounded p-1 py-[0.4rem] border-2 border-gray-100 lg:text-base text-sm"
              name="energymeter"
              id="energymeter"
              onChange={inputEvent}
              value={data.energymeter}
              required
            >
              <option value="" disabled>
                Select Meter
              </option>
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
              <option value="" disabled>
                Select Shift
              </option>
              <option>1</option>
              <option>2</option>
              {/* <option>3</option> */}
              <option>ALL</option>
            </select>
          </div>
          <div>
            <button
              className="w-full lg:mt-6 p-2 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
              type="button"  // Change to type="button" to prevent form submission
               onClick={showResult}
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
                                    <td className="py-2 text-center text-black px-2">
                                      {data.DATE}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.TIME}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.current}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.freq}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.kw}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.kwhr}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.pf}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.voltage}
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
                <KwhrLineChart data={answer} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default EnergyDetailReport;
