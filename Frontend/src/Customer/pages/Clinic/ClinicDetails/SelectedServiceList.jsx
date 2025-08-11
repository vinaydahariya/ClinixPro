import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const SelectedServiceList = ({ handleRemoveService }) => {
  const location = useLocation();
  const { bookingData } = location.state || { bookingData: { services: [] } };

  return (
    <div className="space-y-2 my-5">
      {bookingData?.services?.map((item) => (
        <div
          key={item.id}
          className="py-2 px-4 rounded-md bg-slate-100 flex justify-between items-center"
        >
          <h1 className="font-thin">{item.name}</h1>
          <p>₹{item.price}</p>
          {handleRemoveService && (
            <IconButton onClick={() => handleRemoveService(item.id)}>
              <Close />
            </IconButton>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceList;
