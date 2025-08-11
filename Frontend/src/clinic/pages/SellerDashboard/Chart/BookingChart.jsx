import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, fetchEarnings } from "../../../../Redux/Chart/action";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Backdrop, CircularProgress } from "@mui/material";
// import { LineChart, Line } from 'recharts';
const BookingCharts = () => {
  const dispatch = useDispatch();
  const { chart } = useSelector((store) => store);
  useEffect(() => {
    dispatch(fetchBookings(localStorage.getItem("jwt")));
  }, []);

  if (chart.earnings.loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  console.log("-------- bookings", chart.bookings?.data?.daily);
  return (
    <div className=" h-[40vh] w-full">
      <ResponsiveContainer width="100%" h="100%">
        <LineChart  data={chart.bookings?.data}>
          <Line type="monotone" dataKey="count" stroke="#4da6ff" />
          <XAxis dataKey="daily" />
          <YAxis />
          <Tooltip />
          
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingCharts;
