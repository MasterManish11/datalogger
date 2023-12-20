"use client";
import React from "react";
import { useEffect, useState } from "react";
import MachineData from "./MachineData";
import Loader from "./Loader";
const DashboardData = () => {
  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url =
    process.env.NODE_ENV !== "production"
      ? `${process.env.NEXT_PUBLIC_LOCAL_HOST}api/dashboard`
      : `${process.env.NEXT_PUBLIC_DOMAIN_NAME}api/dashboard`;

  const fetchData = async () => {
    try {
      // Fetch data from your API
      const response = await fetch(url,{ cache: 'no-store' });
      const data = await response.json();
      setMachineData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let interval = setInterval(async () => {
      fetchData();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded overflow-hidden p-2 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  gap-4 py-2">
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {machineData?.map((data, i) => (
            <MachineData data={data} key={i} />
          ))}
        </>
      )}
    </div>
  );
};

export default DashboardData;
