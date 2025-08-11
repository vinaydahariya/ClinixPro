import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const ClinicCard = ({ clinic }) => {
  const navigate = useNavigate();



  // ✅ Dynamic rating calculation (fallback 0 if no reviews)
  const averageRating = clinic?.averageRating || 0;

  return (
    <div onClick={() => navigate(`/clinic/${clinic.id}`)}>
      <div className="w-56 md:w-80 rounded-md bg-slate-100">
        <img
          className="w-full h-[15rem] object-cover rounded-t-md"
          src={clinic.images[0] || "/photos/homePage/clinic_01.jpg"}
          alt=""
        />
        <div className="p-5 space-y-2">
          <h1 className="font-bold text-xl">{clinic.name}</h1>

          {/* ✅ Dynamic Rating */}
          <div>
            <div className={`text-white text-sm p-1 rounded-full w-14 flex items-center justify-center gap-1 
              ${averageRating >= 4 ? "bg-green-700" : averageRating >= 2 ? "bg-yellow-500" : "bg-red-500"}`}>
              {averageRating.toFixed(1)}
              <StarIcon sx={{ fontSize: "16px" }} />
            </div>
          </div>

          <p>{clinic.description?.substring(0, 24) + "..."}</p>
          <p>{clinic.address}, {clinic.city}</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;
