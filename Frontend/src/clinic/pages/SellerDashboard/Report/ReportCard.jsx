import React from 'react';
import "./ReportCard.css";

const ReportCard = ({ value, title, icon }) => {
  return (
    <div className="flex gap-4 items-center p-5 w-full rounded-xl h-[90px] bg-gradient-to-r from-[#4da6ff] to-[#4da6ff] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="rounded-full p-3 bg-white/20 text-white text-2xl">
        {icon}
      </div>
      <div className="text-white">
        <p className="font-bold text-xl">{value}</p>
        <p className="text-sm opacity-80">{title}</p>
      </div>
    </div>
  );
};

export default ReportCard;
