"use client";

import { useEffect, useState } from "react";
import MachineData from "./components/MachineData";
import Loader from "./components/Loader";

const Dashboard = () => {
  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url1 = `${process.env.NEXT_PUBLIC_DOMAIN_NAME}dashboard`;
  const url2 = `${process.env.NEXT_PUBLIC_LOCAL_HOST}dashboard`;
  const url = url2 || url1;
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
  return (
    <div className="container">
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded overflow-hidden p-2 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  gap-4 py-2">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            {machineData.map((data, i) => (
              <MachineData data={data} key={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
