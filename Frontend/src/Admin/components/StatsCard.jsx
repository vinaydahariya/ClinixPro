// components/StatsCard.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card
      className="shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
      style={{ borderTop: `4px solid ${color || "#3b82f6"}` }}
    >
      <CardContent className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <Typography variant="h6" className="text-gray-600">
            {title}
          </Typography>
          <Typography variant="h5" className="font-bold text-black">
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
