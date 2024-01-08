import React from "react";

const MachineData = ({ data }) => {
  return (
    <div>
      <div className="bg-gray-200 h-[372px] flex flex-col space-y-1 border-4 border-white rounded ">
        <h5 className="font-semibold text-center text-white bg-[#0891B2] rounded-t">
          Machine Number :{" "}
          <span className=" text-lg text-white"> {data.Machine_no} </span>
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
        <h5 className="realtimedatawarpper text-yellow-400">
          {data.Production}
        </h5>
        <h5 className="realtimelabelwarpper">
          Runtime
        </h5>
        <h5 className="realtimedatawarpper text-yellow-400">
          {data.Runtime}
        </h5>
        <h5 className="realtimelabelwarpper">
          Efficiency (%)
        </h5>
        <h5 className="realtimedatawarpper text-yellow-400">
          {data.Efficiency}
        </h5>
        <h5 className="realtimelabelwarpper">
          Energy (Kwhr)
        </h5>
        <h5 className="realtimedatawarpper text-yellow-400">
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

