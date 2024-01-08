import React from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const SaveAsPDFButton = () => {
  
  const saveData = (e) => {
    e.preventDefault();
    const pdf = new jsPDF();
    pdf.autoTable({ html: "#table" }); // You may need to adjust this based on your actual table structure
    pdf.save('data.pdf');
  };

  return (
    <button
      className="w-full p-2 lg:mt-6 bg-[#1E7E9E] hover:bg-[#39ADBD] rounded font-semibold text-white"
      onClick={saveData}
    >
      Save AS PDF
    </button>
  );
};

export default SaveAsPDFButton;
