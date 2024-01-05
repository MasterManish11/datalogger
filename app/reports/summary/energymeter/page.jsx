"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Fragment } from "react";
// import Multiselect from "multiselect-react-dropdown";
import KwhrBarChart from "@/app/components/KwhrBarChart";
import Loader from "@/app/components/Loader";
import { Tab } from "@headlessui/react";
import SaveAsCSVButton from "@/app/components/SaveAsCSVButton";
import SaveAsPDFButton from "@/app/components/SaveAsPDFButton";
import internetError from "../../../../public/internetConnectivityError.svg";
import ReportTitle from "@/app/components/ReportTitle";
const EnergySummaryReport = () => {
  // const state = {
  //   options: [
  //     { name: "1", id: 1 },
  //     { name: "2", id: 2 },
  //     //   { name: "3", id: 3 },
  //     //   { name: "4", id: 4 },
  //     //   { name: "5", id: 5 },
  //     //   { name: "6", id: 6 },
  //     //   { name: "7", id: 7 },
  //     //   { name: "8", id: 8 },
  //     //   { name: "9", id: 9 },
  //     //   { name: "10", id: 10 },
  //   ],
  // };
  // const [isSelected, setIsSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [answer, setAnswer] = useState([]);
  const [data, setData] = useState({
    fdate: "",
    tdate: "",
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
  // const onSelect = (selectedList) => {
  //   setIsSelected(selectedList.map((list) => list.name));
  // };
  // const onRemove = (selectedList) => {
  //   setIsSelected(selectedList.map((list) => list.name));
  // };

  const showResult = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();

      // Define the API endpoint
      const apiUrl = "/api/summary/energymeter";

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
      // Handle errors, e.g., log them or show an error message to the user
      console.error("Error in showResult:", error);
    }
  };

  return (
    <div className="content-container">
      <ReportTitle title={"EnergyMeter Summary Report"} />
      <form action="" onSubmit={showResult}>
        <div className="grid lg:grid-cols-7 lg:gap-4 py-2 sm:grid-cols-4 sm:gap-4 grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="fdate" className="font-semibold text-white">
              From date
            </label>

            <input
              type="date"
              name="fdate"
              id="fdate"
              className="w-full rounded p-1 border-2 border-gray-100 lg:text-base text-sm"
              onChange={inputEvent}
              value={data.fdate}
              min="2023-12-02" // specify your minimum date
              max="2023-12-20" // specify your maximum date
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="tdate" className="font-semibold text-white">
              To date
            </label>

            <input
              type="date"
              name="tdate"
              id="tdate"
              className="w-full rounded p-1 border-2 border-gray-100 lg:text-base text-sm"
              onChange={inputEvent}
              value={data.tdate}
              min="2023-12-02" // specify your minimum date
              max="2023-12-20" // specify your maximum date
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="selectEM" className="font-semibold text-white">
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
              <option value="" disabled>Select Meter</option>
              {Array.from({ length: 5 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            {/* <Multiselect
            className="w-full rounded lg:text-base text-sm"
            options={state.options} // Options to display in the dropdown
            selectedValues={state.selectedValue} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            id="selectEM"
          /> */}
          </div>

          <div className="flex flex-col">
            <label htmlFor="shift" className="font-semibold text-white">
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
              <option value="" disabled>Select Shift</option>
              <option>1</option>
              <option>2</option>
              <option>ALL</option>
            </select>
          </div>
          <div>
            <button
              className="w-full lg:mt-6 p-2 bg-[#1E7E9E]  hover:bg-[#39ADBD] rounded font-semibold text-white"
              // onClick={showResult}
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
                      <th scope="col" className="py-2 text-center px-2">
                        Date
                      </th>
                      <th scope="col" className="py-2 text-center px-2">
                        Energymeter
                      </th>
                      <th scope="col" className="py-2 text-center px-2">
                        Kwhr
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
                          <>
                            <tr>
                              <td
                                colSpan="9"
                                className="py-2 text-center font-bold text-lg text-white "
                              >
                                {errorMessage}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            {answer &&
                              answer.map((data, i) => (
                                <React.Fragment key={i}>
                                  <tr className="tableRow">
                                    <th className="pl-2 text-black">
                                      {i == 0 ? 1 : i + 1}
                                    </th>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.date}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.energymeter}
                                    </td>
                                    <td className="py-2 text-black text-center px-2">
                                      {data.kwhr?.toFixed(2)}
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
                    className="text-white"
                  />
                  <p className="text-center font-semibold text-white">
                    {errorMessage}
                  </p>
                </div>
              ) : (
                <>{answer.length > 0 && <KwhrBarChart data={answer} />}</>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
export default EnergySummaryReport;
