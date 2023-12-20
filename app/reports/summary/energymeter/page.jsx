"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Multiselect from "multiselect-react-dropdown";
import { mkConfig, generateCsv, download } from "export-to-csv";
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const EnergySummaryReport = () => {
  const state = {
    options: [
      { name: "1", id: 1 },
      { name: "2", id: 2 },
      //   { name: "3", id: 3 },
      //   { name: "4", id: 4 },
      //   { name: "5", id: 5 },
      //   { name: "6", id: 6 },
      //   { name: "7", id: 7 },
      //   { name: "8", id: 8 },
      //   { name: "9", id: 9 },
      //   { name: "10", id: 10 },
    ],
  };
  const [isSelected, setIsSelected] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [data, setData] = useState({
    fdate: "",
    tdate: "",
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

  const onSelect = (selectedList) => {
    setIsSelected(selectedList.map((list) => list.name));
  };
  const onRemove = (selectedList) => {
    setIsSelected(selectedList.map((list) => list.name));
  };

  const showResult = async (event) => {
    try {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Define the API endpoint
      const apiUrl = "/api/summary/energymeter";

      // Prepare the request options
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data,isSelected }), // Assuming `data` is defined elsewhere
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
    <div className="content-container bg-gradient-to-r from-cyan-400 to-blue-400 py-3 rounded">
      <div className="py-1">
        <h1 className="report-title">EnergyMeter Summary Report</h1>
      </div>
      <div className="grid lg:grid-cols-7 lg:gap-4 py-2 grid-cols-3 gap-4">
        <div>
          <label htmlFor="fdate" className="font-semibold">
            {" "}
            from date
          </label>

          <input
            type="date"
            name="fdate"
            id="fdate"
            className="w-full rounded p-1 border-2 border-gray-100 lg:text-base text-sm"
            onChange={inputEvent}
            value={data.fdate}
          />
        </div>
        <div>
          <label htmlFor="tdate" className="font-semibold">
            {" "}
            Select date
          </label>

          <input
            type="date"
            name="tdate"
            id="tdate"
            className="w-full rounded p-1 border-2 border-gray-100 lg:text-base text-sm"
            onChange={inputEvent}
            value={data.tdate}
          />
        </div>
        <div className="">
          <label htmlFor="selectEM" className="font-semibold">
            {" "}
            Select Meter
          </label>
          <Multiselect
            className="w-full rounded lg:text-base text-sm"
            options={state.options} // Options to display in the dropdown
            selectedValues={state.selectedValue} // Preselected value to persist in dropdown
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            id="selectEM"
          />
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
            Save as csv
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
            className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            id="table"
          >
            <thead className="text-xs text-gray-50 uppercase bg-blue-600 dark:bg-gray-700 dark:text-gray-400">
              <tr className="">
                <th></th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Current
                </th>
                <th scope="col" className="px-6 py-3">
                  Frequency
                </th>
                <th scope="col" className="px-6 py-3">
                  KW
                </th>
                <th scope="col" className="px-6 py-3">
                  KWhr
                </th>
                <th scope="col" className="px-6 py-3">
                  pf
                </th>
                <th scope="col" className="px-6 py-3">
                  voltage
                </th>
              </tr>
            </thead>
            <tbody className="h-48 overflow-y-auto">
              {answer &&
                answer.map((data, i) => (
                  <>
                    <tr
                      key={i}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 "
                    >
                      <th>{i == 0 ? 1 : i + 1}</th>
                      <td className="px-2 py-4">{data.DATE}</td>
                      <td className="px-2 py-4">{data.TIME}</td>
                      <td className="px-2 py-4">{data.current}</td>
                      <td className="px-2 py-4">{data.freq}</td>
                      <td className="px-2 py-4">{data.kw}</td>
                      <td className="px-2 py-4">{data.kwhr}</td>
                      <td className="px-2 py-4">{data.pf}</td>
                      <td className="px-2 py-4">{data.voltage}</td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergySummaryReport;
