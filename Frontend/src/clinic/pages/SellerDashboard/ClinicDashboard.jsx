import React, { useEffect } from "react";

import Navbar from "../../../admin seller/components/navbar/Navbar";
import ClinicRoutes from "../../../routes/ClinicRoutes";
import { useDispatch } from "react-redux";
import { fetchClinicByOwner } from "../../../Redux/Clinic/action";
import ClinicDrawerList from "../../components/SideBar/DrawerList";
import { getClinicReport } from "../../../Redux/Booking/action";

const ClinicDashboard = () => {
  const dispatch=useDispatch();
  // const {}
  useEffect(() => {
    dispatch(fetchClinicByOwner(localStorage.getItem("jwt")));
    dispatch(getClinicReport(localStorage.getItem("jwt")))
  }, []);


  return (
    <div className="min-h-screen">
      <Navbar DrawerList={ClinicDrawerList}/>
      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
        <ClinicDrawerList/>
        </div>
        <div className="p-10 w-full lg:w-[80%]  overflow-y-auto">
          <ClinicRoutes />
        </div>
      </section>
    </div>
  );
};

export default ClinicDashboard;
