import React, { useEffect } from "react";

import ReportCard from "./Report/ReportCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import EarningCharts from "./Chart/EarningCharts";
import BookingCharts from "./Chart/BookingChart";
import { useSelector } from "react-redux";

const Chart = [
  { name: "Today", value: "today" },
  { name: "Last 7 days", value: "daily" },
  { name: "Last 12 Month", value: "monthly" },
];

const HomePage = () => {
  const [chartType, setChartType] = React.useState(Chart[0].value);
  const {booking}=useSelector(store=>store)
  console.log("clinic booking ",booking)

  useEffect(() => {}, []);

  const handleChange = (event) => {
    setChartType(event.target.value);
  };
  return (
   <div className="space-y-5">
     <div className=" lg:flex gap-5">
      <div className=" space-y-10 rounded-md w-full lg:w-[70%] ">
        <div>
          <div className="border rounded-lg p-5 w-full ">
            <h1 className="text-lg font-bold pb-5 text-[#4da6ff] ">
              Total Revanue
            </h1>

            <EarningCharts />
          </div>
        </div>
      </div>
      <section className="space-y-5 w-full lg:w-[30%]">
        
          <ReportCard
            icon={<AccountBalanceIcon />}
            value={"₹ " + "" + booking.report?.totalEarnings}
            title={"Total Earnings"}
          />
    
        
          <ReportCard
            icon={<AccountBalanceIcon />}
            value={booking.report?.totalBookings}
            title={"Total Bookings"}
          />
    
        
          <ReportCard
            icon={<AccountBalanceIcon />}
            value={"₹ " + booking.report?.totalRefund}
            title={"Total Refund"}
          />
    

        
          <ReportCard
            icon={<AccountBalanceIcon />}
            value={booking.report?.cancelledBookings}
            title={"Cancel Bookings"}
          />

      </section>
    </div>
    <div className=" space-y-10 rounded-md w-full ">
        <div>
          <div className="border rounded-lg p-5 w-full ">
            <h1 className="text-lg font-bold pb-5 text-[#4da6ff] ">
              Booking Chart
            </h1>

            <BookingCharts />
          </div>
        </div>
      </div>
   </div>
  );
};

export default HomePage;
