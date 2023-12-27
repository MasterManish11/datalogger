"use client";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Multiselect from "multiselect-react-dropdown";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Loader from "@/app/components/Loader";
import ProductionBarchart from "@/app/components/ProductionBarchart";
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const ProductionSummaryReport = () => {
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
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState([]);
  const [data, setData] = useState({
    fdate: "",
    tdate: "",
    machine: "",
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
      setLoading(true);

      // Prevent the default form submission behavior
      event.preventDefault();

      // Define the API endpoint
      const apiUrl = "/api/summary/production";

      // Prepare the request options
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, isSelected }), // Assuming `data` is defined elsewhere
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
      // console.log("responseData",responseData)
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
        <h1 className="report-title">Production Summary Report</h1>
      </div>
      <div className="grid lg:grid-cols-7 lg:gap-4 py-2 sm:grid-cols-4 sm:gap-4 grid-cols-2 gap-4"  >
        <div>
          <label htmlFor="fdate" className="font-semibold">
            {" "}
            From date
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
            To date
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
            Select Machine
          </label>
          <select
            className="w-full rounded p-1 py-[0.4rem] border-2 border-gray-100 lg:text-base text-sm"
            name="machine"
            id="machine"
            onChange={inputEvent}
            value={data.machine}
          >
            <option selected>Select Machine</option>
            <option>1</option>
            <option>2</option>
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
            View
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
        <Tabs>
          <TabList>
            <Tab>Table View</Tab>
            <Tab>Graphical view</Tab>
          </TabList>

          <TabPanel>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:min-h-[200px] min-h-[484px] overflow-y-auto">
              <table
                className="tableContainer"
                id="table"
              >
                <thead className="thead">
                  <tr>
                    <th>No</th>
                    <th scope="col" className="py-2 text-center">
                      Date
                    </th>
                    <th scope="col" className="py-2 text-center">
                      Machine
                    </th>
                    <th scope="col" className="py-2 text-center">
                      Runtime
                    </th>
                    <th scope="col" className="py-2 text-center">
                      Stoptime
                    </th>
                    <th scope="col" className="py-2 text-center">
                      Efficiency
                    </th>
                    <th scope="col" className="py-2 text-center">
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
                      {answer &&
                        answer.map((data, i) => (
                          <React.Fragment key={i}>
                            <tr className="tableRow">
                              <th>{i == 0 ? 1 : i + 1}</th>
                              <td className="py-2 text-center">{data.date}</td>
                              <td className="py-2 text-center">
                                {data.machine}
                              </td>
                              <td className="py-2 text-center">
                                {`${data.runTime.hours}H ${data.runTime.minutes}M`}
                              </td>
                              <td className="py-2 text-center">
                                {`${data.stopTime.hours}H ${data.stopTime.minutes}M`}
                              </td>
                              <td className="py-2 text-center">
                                {data.efficiency}
                              </td>
                              <td className="py-2 text-center">
                                {data.production}
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
            {answer.length > 0 && <ProductionBarchart data={answer} />}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductionSummaryReport;
