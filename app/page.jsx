'use client'
import { useEffect, useState } from "react";
import MachineData from "./components/MachineData";

const Dashboard = () => {
  const[machineData,setMachineData]= useState([])
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:3000/api/dashboard"||"https://datalogger.vercel.app/api/dashboard"
  useEffect(() => {
    let interval = setInterval(async () => {
      const response = await fetch(url);
      const data = await response.json();
      setMachineData(data);
      setLoading(false);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log("dashboarData", data);
  return (
    <div className="container">
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded overflow-hidden p-2 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  gap-4 py-2">
        {machineData &&
           machineData.map((data, i) => <MachineData data={data} key={i} />)}
      </div>
    </div>
  );
};

export default Dashboard;
