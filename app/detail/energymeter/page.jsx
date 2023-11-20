"use client";
import React, { useState } from "react";
import jsPDF from 'jspdf'
import "jspdf-autotable"
import { mkConfig, generateCsv, download } from "export-to-csv";
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const DetailReport = () => {
  const [answer, setAnswer] = useState([]);
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

  const showResult = async (e) => {
    e.preventDefault();
    const url = "/api/energyconsumption/detail";
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    // console.log("response",response)
    setAnswer(response);
  };

const saveData =()=>{
const pdf = new jsPDF()
pdf.autoTable({html:"#table"})
pdf.save("data.pdf")
}

const saveAsCSV = ()=>{
  const csv = generateCsv(csvConfig)(answer);
  download(csvConfig)(csv)
}


  return (
    <div className="content-container bg-teal-200">
      <div className="bg-orange-300 rounded py-1 my-1">
        <h1 className="text-center">Detail Report page</h1>
      </div>
      <div className="flex justify-center items-center space-x-2">
        <input
          type="date"
          name="date"
          id="date"
          className="rounded"
          onChange={inputEvent}
          value={data.date}
        />
        <div>
          <select
            className=" w-full max-w-xs rounded"
            name="energymeter"
            id="energymeter"
            onChange={inputEvent}
            value={data.energymeter}
          >
            <option selected>Select EnergyMeter</option>
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div>
          <select
            className="w-full max-w-xs rounded"
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
        <button className="p-2 bg-green-400 rounded" onClick={showResult}>
          Show Result
        </button>
        <button className="p-2 bg-green-400 rounded" onClick={saveAsCSV}>
          Save as csv
        </button>
        <button className="p-2 bg-purple-400 rounded" onClick={saveData} >Save AS PDF</button>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table table-xs" id="table">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Time</th>
                <th>Current</th>
                <th>Frequency</th>
                <th>KW</th>
                <th>KWhr</th>
                <th>pf</th>
                <th>voltage</th>
              </tr>
            </thead>
            <tbody>
              {answer &&
                answer.map((data, i) => (
                  <>
                    <tr key={i}>
                      <th>{i == 0 ? 1 : i + 1}</th>
                      <td>{data.DATE}</td>
                      <td>{data.TIME}</td>
                      <td>{data.current}</td>
                      <td>{data.freq}</td>
                      <td>{data.kw}</td>
                      <td>{data.kwhr}</td>
                      <td>{data.pf}</td>
                      <td>{data.voltage}</td>
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

export default DetailReport;
