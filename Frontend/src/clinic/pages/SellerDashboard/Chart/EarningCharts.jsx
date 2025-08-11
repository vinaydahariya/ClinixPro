import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings } from "../../../../Redux/Chart/action";
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
const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];
const EarningCharts = () => {
  const dispatch = useDispatch();
  const { chart } = useSelector((store) => store);
  useEffect(() => {
    dispatch(fetchEarnings(localStorage.getItem("jwt")));
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
  console.log("boooking -------- ", chart.earnings?.data);
  return (
    <div className=" h-[40vh] w-full">
      <ResponsiveContainer width="100%" h="100%">
        <LineChart  data={chart.earnings?.data}>
          <Line type="monotone" dataKey="earnings" stroke="#4da6ff" />
          <XAxis dataKey="daily" />
          <YAxis />
          <Tooltip />
          
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningCharts;
