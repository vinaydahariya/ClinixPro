// import React, { useEffect } from "react";
// import ClinicCard from "./ClinicCard";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchClinics } from "../../../Redux/Clinic/action";

// const ClinicList = ({clinics}) => {

//   return (
//     <div className="flex gap-6 flex-wrap ">
//       {clinics?.map((item) => (
//         <ClinicCard key={item.id} clinic={item}/>
//       ))}
//     </div>
//   );
// };

// export default ClinicList;

import React, { useEffect } from "react";
import ClinicCard from "./ClinicCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMultipleClinicRatings } from "../../../Redux/Review/action";

const ClinicList = ({ clinics }) => {
  const dispatch = useDispatch();
  const { ratings } = useSelector((state) => state.review);

  useEffect(() => {
    if (clinics?.length > 0) {
      const clinicIds = clinics.map((c) => c.id);
      dispatch(fetchMultipleClinicRatings(clinicIds));
    }
  }, [clinics, dispatch]);

  return (
    <div className="flex gap-6 flex-wrap ">
      {clinics?.map((item) => (
        <ClinicCard 
          key={item.id} 
          clinic={{ ...item, averageRating: ratings[item.id] || 0 }} 
        />
      ))}
    </div>
  );
};

export default ClinicList;

