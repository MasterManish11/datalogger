// components/FixedTable.js
import React from "react";

const FixedTable = () => {
  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 1000; i++) {
      rows.push(
        <tr key={i}>
          <td className="text-center">Row {i}</td>
          <td className="text-center">Data 1</td>
          <td className="text-center">Data 2</td>
          <td className="text-center">Data 3</td>
          {/* Add more columns as needed */}
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Scrollable Table with Fixed Header
      </h1>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className={`min-w-full border-collapse w-full `}>
          <thead className='sticky top-0 bg-white z-10'>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
              <th>Header 3</th>
              <th>Header 4</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>{generateRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedTable;
