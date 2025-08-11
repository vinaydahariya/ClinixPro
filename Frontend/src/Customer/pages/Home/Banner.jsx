import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("city");

  return (
    <div className="w-full relative h-[80vh]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        src="/videos/clinixproBanner.mp4"
      ></video>

      <div className="textPart absolute flex flex-col items-center justify-center inset-0 text-white z-20 space-y-4 px-5">
        <h1 className="text-5xl font-bold">Be your self</h1>
        <p className="text-slate-300 text-2xl text-center font-semibold">
          Connect with Nearby Clinics and Book Instantly
        </p>

        {/* Transparent Toggle */}
        <div className="flex backdrop-blur-md bg-white/20 rounded-full overflow-hidden shadow-lg border border-white/30">
          <button
            onClick={() => setSearchType("city")}
            className={`px-6 py-2 font-semibold transition-all duration-300 ${
              searchType === "city"
                ? "bg-white/30 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            City
          </button>
          <button
            onClick={() => setSearchType("service")}
            className={`px-6 py-2 font-semibold transition-all duration-300 ${
              searchType === "service"
                ? "bg-white/30 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            Service
          </button>
        </div>

        {/* Search bar */}
        <input
          key={searchType} // force re-render
          readOnly
          onClick={() => navigate(`/search?type=${searchType}`)}
          className="cursor-pointer border-none backdrop-blur-md bg-white/20 text-white placeholder-white/70 rounded-md py-4 w-[15rem] md:w-[33rem] outline-none px-5 shadow-md"
          placeholder={`Search clinic by ${searchType}...`}
        />
      </div>

      <div className="z-10 absolute top-0 bottom-0 right-0 left-0 bg-black opacity-75"></div>
    </div>
  );
};

export default Banner;
