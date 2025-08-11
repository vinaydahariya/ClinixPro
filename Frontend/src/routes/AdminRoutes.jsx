import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Admin/pages/Home/Home'
import ClinicTable from '../Admin/pages/clinic/ClinicTable'
import CustomerTable from '../Admin/pages/customer/CustomerTable'
import BookingTable from '../Admin/pages/Booking/BookingTable'
import Report from '../Admin/pages/Report/Report'
import Profile from '../Admin/pages/Profile/Profile'
import UpdateProfile from '../Admin/pages/customer/updateProfile'
import UpdateClinic from '../Admin/pages/clinic/UpdateClinic'
import Notification from '../Admin/pages/Notifications/Notification'



const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/clinic" element={<ClinicTable/>} />
      <Route path="/user" element={<CustomerTable/>} />
      <Route path="/booking" element={<BookingTable/>} />
      <Route path="/report" element={<Report/>} />
      <Route path="/account" element={<Profile/>} />
      <Route path="/notifications" element={<Notification/>} />
      <Route path="/user/update-profile" element={<UpdateProfile/>}/>
      <Route path="/clinic/update-clinic" element={<UpdateClinic/>}/>
      <Route path="/clinic/update-clinic/:id" element={<UpdateClinic />} />
      {/* <Route path="/category/:id" element={<Category />} /> */}
  </Routes>
  )
}

export default AdminRoutes