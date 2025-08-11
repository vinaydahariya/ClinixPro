import React from 'react'
import Navbar from '../Customer/pages/Navbar/Navbar'
import Footer from '../Customer/pages/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from '../Customer/pages/Home/Home'
import ClinicDetails from '../Customer/pages/Clinic/ClinicDetails/ClinicDetails'
import Bookings from '../Customer/pages/Bookings/Bookings'
import NotFound from '../Customer/pages/NotFound/NotFound'
import PaymentSuccessHandler from '../Customer/pages/Payment/PaymentSuccessHandler'
import Notification from '../Customer/pages/Notifications/Notification'
import SearchClinic from '../Customer/pages/Clinic/SearchClinic'
import UpdateProfile from '../Customer/pages/Home/updateProfile'
import ClinicServiceDetails from '../Customer/pages/Clinic/ClinicDetails/ClinicServiceDetails'
import Contact from '../Customer/pages/Footer/Contact'
import About from '../Customer/pages/Footer/About'
import RefundSuccess from '../Customer/pages/Bookings/RefundSuccess'
import ResetPasswordRequest from '../Auth/ResetPaswordRequest'
import ResetPasswordForm from '../Auth/ResetPasswordForm'
import PasswordChangeSuccess from '../Auth/PasswordChangeSuccess'

const CustomerRoutes = () => {
  return (
    <>
      <Navbar />

      <div className='pb-20 min-h-[90vh] mt-[5rem]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/clinic/:id' element={<ClinicDetails />} />
          <Route path='/bookings' element={<Bookings />} />
          <Route path='/search' element={<SearchClinic />} />
          <Route path='/notifications' element={<Notification type={"USER"} />} />
          <Route path='/payment-success/:id' element={<PaymentSuccessHandler />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path="/clinic-service-details" element={<ClinicServiceDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refund-success" element={<RefundSuccess />} />
          <Route path="/reset-password-request" element={<ResetPasswordRequest/>}/>
          {/* form dummy it change when backend complete */}
          <Route path= "/reset-password-form" element ={<ResetPasswordForm/>}/>
          <Route path= "/password-change-success" element ={<PasswordChangeSuccess/>}/>

          
          {/* fallback */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default CustomerRoutes
