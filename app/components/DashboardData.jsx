"use client";
// import React from "react";
// import { useEffect, useState } from "react";
// import MachineData from "./MachineData";
// import Loader from "./Loader";
// import Image from "next/image";
// import internetError from "../../public/internetConnectivityError.svg";
// const DashboardData = () => {
//   const [machineData, setMachineData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const url =
//     process.env.NODE_ENV !== "production"
//       ? `${process.env.NEXT_PUBLIC_LOCAL_HOST}api/dashboard`
//       : `${process.env.NEXT_PUBLIC_DOMAIN_NAME}api/dashboard`;

//   const fetchData = async () => {
//     try {
//       console.log("fetch")
//       // setLoading(true);
//       // Fetch data from your API
//       const response = await fetch(url, { cache: "no-store" });
//       const responseData = await response.json();
//       if (responseData.message) {
//         setErrorMessage(responseData.message);
//         setMachineData([]);
//       } else {
//         setMachineData(responseData);
//         setErrorMessage(null);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     let interval = setInterval(async () => {
//       fetchData();
//     }, 3000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);
//   return (
//     <div className="min-h-screen rounded overflow-hidden px-2 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-4 py-2">
//       {loading ? (
//         <>
//           <Loader />
//         </>
//       ) : (
//         <>
//           {errorMessage ? (
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <div className="py-2 text-center font-bold text-lg text-white">
//                 <div className="flex flex-col items-center">
//                   <Image
//                     src={internetError}
//                     alt="SVG Image"
//                     width={100}
//                     height={100}
//                   />
//                   <p className="text-center font-semibold text-white">
//                     {errorMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               {machineData?.slice(0, 5).map((data, i) => (
//                 <div key={i} className="flex justify-center items-center">
//                   <div className="w-full max-w-md">
//                     <MachineData data={data} key={i} />
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default DashboardData;

import React, { useState, useEffect } from "react";
import MachineData from "./MachineData";
import Loader from "./Loader";
import Image from "next/image";
import internetError from "../../public/internetConnectivityError.svg";

const DashboardData = () => {
  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const responseData = await response.json();

      if (responseData.message) {
        setErrorMessage(responseData.message);
        setMachineData([]);
      } else {
        setMachineData(responseData);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("An error occurred while fetching data.");
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const url =
    process.env.NODE_ENV !== "production"
      ? `${process.env.NEXT_PUBLIC_LOCAL_HOST}api/dashboard`
      : `${process.env.NEXT_PUBLIC_DOMAIN_NAME}api/dashboard`;

  useEffect(() => {
    setIsMounted(true);

    const fetchDataAndReload = async () => {
      await fetchData();
      // Additional logic for HotReload can be placed here
    };

    fetchDataAndReload();

    const interval = setInterval(fetchDataAndReload, 5000);

    return () => {
      setIsMounted(false);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen rounded overflow-hidden px-2 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-4 py-2">
      {loading ? (
        <Loader />
      ) : errorMessage ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="py-2 text-center font-bold text-lg text-white">
            <div className="flex flex-col items-center">
              <Image src={internetError} alt="SVG Image" width={100} height={100} />
              <p className="text-center font-semibold text-white">{errorMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        Array.isArray(machineData) && machineData?.slice(0, 5).map((data, i) => (
          <div key={i} className="flex justify-center items-center">
            <div className="w-full max-w-md">
              <MachineData data={data} key={i} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardData;
