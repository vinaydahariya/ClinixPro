import React, { useEffect, useState } from 'react'
import AdminRoutes from '../../../routes/AdminRoutes'
// import DrawerList from './DrawerList'
import Navbar from '../../components/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import { Alert, Snackbar } from '@mui/material'
import { useDispatch } from "react-redux";
import { getClinicReport } from "../../../Redux/Booking/action"
import {getAllCustomers} from "../../../Redux/Auth/action"
// import { fetchClinicByOwner } from "../../../Redux/Clinic/action";


const AdminDashboard = () => {
    const dispatch=useDispatch();
    // const {}
    useEffect(() => {
      // dispatch(fetchCustomerBookings(localStorage.getItem("jwt")));
      dispatch(getAllCustomers(localStorage.getItem("jwt")))
    }, []);

    // console.log("admin")

  return (
    <>
      <div className="min-h-screen">
        <Navbar DrawerList={AdminDrawerList} />
        <section className="lg:flex lg:h-[90vh]">
          <div className="hidden lg:block h-full">
            <AdminDrawerList />
          </div>
          <div className="p-10 w-full lg:w-[80%]  overflow-y-auto">
            <AdminRoutes />
          </div>
        </section>

      </div>
    </>



  )
}

export default AdminDashboard