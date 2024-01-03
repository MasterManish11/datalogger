import React from "react";
import { generateCsv, download, mkConfig } from "export-to-csv";
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const SaveAsCSVButton = ({ data }) => {
  const saveAsCSV = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  return (
    <button
      className="w-full p-2 lg:mt-6 bg-[#1E7E9E] hover:bg-[#39ADBD] rounded font-semibold text-white"
      onClick={saveAsCSV}
    >
      <span>Save As CSV</span>
    </button>
  );
};

export default SaveAsCSVButton;
