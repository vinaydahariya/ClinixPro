import React from "react";
import { Link } from "react-router-dom";

const RefundSuccess = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white w-[380px] p-8 rounded-xl shadow-lg text-center space-y-5">
        <h1 className="text-2xl font-bold text-green-600">Refund Initiated</h1>
        <p className="text-gray-600">
          Your refund amount will be transferred to you within{" "}
          <span className="font-semibold">7-8 working days</span>.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default RefundSuccess;
