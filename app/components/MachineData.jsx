import React from "react";

const MachineData = ({ data }) => {
  return (
    <div>
      <div className="bg-gray-200 h-[372px] flex flex-col space-y-1 border-4 border-white rounded ">
        <h5 className="font-semibold text-center bg-gradient-to-r from-indigo-300 from-10% via-sky-300 via-30% to-emerald-300 to-90% text-black rounded-t">
          Machine Number :{" "}
          <span className=" text-lg text-red-600"> {data.Machine_no} </span>
        </h5>
        {/* <h5 className="font-semibold text-center bg-slate-800 text-white">
          Machine Name
        </h5> */}
        {/* <h5 className="font-semibold text-center bg-blue-600 text-white">
          {data.machineName}
        </h5> */}
        <h5 className="realtimelabelwarpper">
          Speed (Pcs/Hr)
        </h5>
        <h5 className="realtimedatawarpper text-yellow-400">
          {data.Speed}
        </h5>
        <h5 className="realtimelabelwarpper">
          Production (Piece)
        </h5>
        <h5 className="realtimedatawarpper text-purple-400">
          {data.Production}
        </h5>
        <h5 className="realtimelabelwarpper">
          Runtime
        </h5>
        <h5 className="realtimedatawarpper text-green-400">
          {data.Runtime}
        </h5>
        <h5 className="realtimelabelwarpper">
          Efficiency (%)
        </h5>
        <h5 className="realtimedatawarpper text-sky-400">
          {data.Efficiency}
        </h5>
        <h5 className="realtimelabelwarpper">
          Energy (Kwhr)
        </h5>
        <h5 className="realtimedatawarpper text-pink-400">
          {data.Kwhr}
        </h5>
        <h5 className="realtimelabelwarpper">
          Status
        </h5>
        <h5 className={`realtimedatawarpper ${data.Status==='RUN'? 'text-green-500':'text-red-500'}  rounded-b`}>
          {data.Status}
        </h5>
      </div>
    </div>
  );
};

export default MachineData;

