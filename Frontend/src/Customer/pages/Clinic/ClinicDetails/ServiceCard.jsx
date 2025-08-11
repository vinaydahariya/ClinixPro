import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Button } from "@mui/material";

const ServiceCard = ({ service, isSelected, onSelect, onRemove }) => {
  return (
    <div className="w-full">
      {/* <h1 className='pb-5 text-3xl font-bold'>Hair Cutting and Beard</h1> */}
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-1 w-[60%]">
          <h1 className="text-2xl font-semibold">{service.name}</h1>
          <p className="text-gray-500 text-sm">{service.description}</p>
          <div className="flex items-center gap-3">
            <p>₹{service.price} </p>
            <FiberManualRecordIcon sx={{ fontSize: "10px", color: "gray" }} />
            <p>{service.duration} mins</p>
          </div>
        </div>
        <div className="space-y-3 ">
          <img
            className="w-32 h-32 object-cover rounded-md"
            src={service.image}
            alt=""
          />
          <Button
            onClick={() =>
              isSelected ? onRemove(service.id) : onSelect(service)
            }
            fullWidth
            variant="outlined"
          >
            {isSelected ? "remove" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
