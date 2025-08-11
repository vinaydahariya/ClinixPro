import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../clinic/pages/SellerDashboard/HomePage";
import Services from "../clinic/pages/ClinicService/Services";
import ServiceForm from "../clinic/pages/ClinicService/AddServiceForm";
import Profile from "../clinic/pages/Account/Profile";
import Category from "../clinic/pages/Category/Category";
import BookingTable from "../clinic/pages/Bookings/BookingTable";
import Payment from "../clinic/pages/Payment/Payment";
import TransactionTable from "../clinic/pages/Payment/TransactionTable";
import Notification from "../Customer/pages/Notifications/Notification";
import UpdateClinic from "../clinic/pages/Account/UpdateClinic";
import SettlementSuccess from "../clinic/pages/Payment/SettlementSuccess";


const ClinicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<Services />} />
      <Route path="/add-services" element={<ServiceForm />} />

      <Route path="/bookings" element={<BookingTable />} />

      <Route path="/account" element={<Profile />} />

      <Route path="/category" element={<Category />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/transaction" element={<TransactionTable />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="update-clinic" element={<UpdateClinic/>} />
      <Route path="/settlement-success" element={<SettlementSuccess />} />
    </Routes>
  );
};

export default ClinicRoutes;
