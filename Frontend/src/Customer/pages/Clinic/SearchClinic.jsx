import React, { useState } from "react";
import ClinicList from "./ClinicList";
import { useDispatch, useSelector } from "react-redux";
import { searchClinic } from "../../../Redux/Clinic/action";
import { searchClinicsByService } from "../../../Redux/Clinic Services/action";
import { useLocation } from "react-router-dom";

const SearchClinic = () => {
  const { clinic, service } = useSelector((store) => store);
  const dispatch = useDispatch();
  const location = useLocation();

  // Get search type from URL query
  const params = new URLSearchParams(location.search);
  const searchType = params.get("type") || "city";

  const handleSearch = (e) => {
    const value = e.target.value.trim();

    if (searchType === "city") {
      dispatch(searchClinic({ jwt: localStorage.getItem("jwt"), city: value }));
    } else {
      dispatch(searchClinicsByService(value)); // ✅ Direct string pass
    }
  };

  return (
    <div className="lg:px-20 px-5">
      <div className="flex flex-col justify-center items-center pb-10 text-white z-20 space-y-3 px-5">
        <input
          onChange={handleSearch}
          className="cursor-pointer border bg-white rounded-md py-4 w-[15rem] md:w-[33rem] outline-none text-black px-5"
          placeholder={
            searchType === "city"
              ? "Search clinic by city..."
              : "Search clinic by service..."
          }
        />
      </div>

      <div>
        <ClinicList
          clinics={
            searchType === "city"
              ? clinic?.searchClinics || []
              : service?.clinicsByService || []
          }
        />
      </div>
    </div>
  );
};

export default SearchClinic;
