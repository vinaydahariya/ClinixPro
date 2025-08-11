import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import StatsCard from '../../components/StatsCard';

import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

import {
  getTotalUsers,
  getTotalClinics,
  getTotalBookingsByStatus,
  getTotalEarnings,
  getTotalRefunds
} from "../../../util/adminStats"; 

import { fetchClinics } from "../../../Redux/Clinic/action";
import { fetchAllBookings } from "../../../Redux/Booking/action";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const bookingChartData = [
  { name: 'Jan', bookings: 40 },
  { name: 'Feb', bookings: 60 },
  { name: 'Mar', bookings: 45 },
  { name: 'Apr', bookings: 80 },
  { name: 'May', bookings: 50 },
  { name: 'Jun', bookings: 75 },
];

const Home = () => {
  const dispatch = useDispatch();

  // ✅ Redux state
  const { user, token } = useSelector((state) => state.auth || {});
  const store = useSelector((state) => state);

  const role = user?.role || null;

  useEffect(() => {
    dispatch(fetchClinics());

    // ✅ Only admin + token ke saath bookings fetch
    if (role === "ADMIN" && token) {
      dispatch(fetchAllBookings({ jwt: token }));
    }
  }, [dispatch, token, role]);

  


  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={getTotalUsers(store)}
          icon={<PeopleIcon fontSize="large" />}
          color="#4F46E5"
        />
        <StatsCard
          title="Total Clinics"
          value={getTotalClinics(store)}
          icon={<LocalHospitalIcon fontSize="large" />}
          color="#10B981"
        />

        {/* Admin-only booking stats */}
        {role === "ADMIN" && (
          <>
            <StatsCard
              title="Confirmed Bookings"
              value={getTotalBookingsByStatus(store, "CONFIRMED")}
              icon={<EventAvailableIcon fontSize="large" />}
              color="#F59E0B"
            />
            <StatsCard
              title="Successful Bookings"
              value={getTotalBookingsByStatus(store, "SUCCESS")}
              icon={<DoneAllIcon fontSize="large" />}
              color="#22C55E"
            />
            <StatsCard
              title="Cancelled Bookings"
              value={getTotalBookingsByStatus(store, "CANCELLED")}
              icon={<EventBusyIcon fontSize="large" />}
              color="#EF4444"
            />
            <StatsCard
              title="Total Earnings"
              value={`₹ ${getTotalEarnings(store)}`}
              icon={<PaymentsIcon fontSize="large" />}
              color="#3B82F6"
            />
            <StatsCard
              title="Total Refunds"
              value={`₹ ${getTotalRefunds(store)}`}
              icon={<MoneyOffIcon fontSize="large" />}
              color="#8B5CF6"
            />
          </>
        )}
      </div>

      {/* BOOKING CHART (Admin only) */}
      {role === "ADMIN" && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Bookings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Home;
