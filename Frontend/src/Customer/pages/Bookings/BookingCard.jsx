import React, { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { IconButton, Menu, MenuItem, Modal, Button, Snackbar, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { updateBookingStatus, updateBookingSlot } from "../../../Redux/Booking/action";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefundForm from "./RefundForm";

const BookingCard = ({ booking, onRemove }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ Update Slot
  const handleUpdateSlot = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleUpdateBookingSlot = () => {
    if (!selectedDateTime) return;

    const payload = {
      serviceIds: booking?.services?.map((s) => s.id),
      startTime: selectedDateTime,
    };

    dispatch(
      updateBookingSlot({
        bookingId: booking?.id,
        bookingData: payload,
        jwt: localStorage.getItem("jwt"),
      })
    ).then(() => {
      setSuccessPopup(true);
      setOpenModal(false);
    });
  };

  const handleRemoveFromList = () => {
    onRemove(booking.id);
    handleMenuClose();
  };

  // ✅ Cancel booking -> Update status only
  const handleCancelBooking = () => {
    dispatch(
      updateBookingStatus({
        bookingId: booking?.id,
        status: "CANCELLED",
        jwt: localStorage.getItem("jwt"),
      })
    );
    handleMenuClose();
  };

  // ✅ Refund Booking option
  const handleRefundBooking = () => {
    setOpenRefundModal(true);
    handleMenuClose();
  };

  const handleRefundSubmit = (refundData) => {
    console.log("Refund Data Submitted: ", refundData);
    setOpenRefundModal(false);
    navigate("/refund-success");
  };

  const handleCompleteBooking = () => {
    if (booking?.bookingStatus === "PENDING") {
      navigate(`/clinic-service-details`, {
        state: {
          bookingData: booking,
          clinicId: booking?.clinic?.id,
        },
      });
    }
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "PENDING":
        return "text-blue-600";
      case "CANCELLED":
        return "text-red-600";
      case "SUCCESS":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-5 rounded-md bg-slate-100 flex flex-col relative">
      {/* 3-dot menu */}
      <div className="absolute top-2 right-2 z-20">
        <IconButton
          size="small"
          className="bg-white shadow-md rounded-full"
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          MenuListProps={{
            sx: {
              "& .MuiMenuItem-root": {
                fontSize: "14px",
                fontWeight: "normal",
              },
            },
          }}
        >
          <MenuItem
            onClick={handleUpdateSlot}
            disabled={booking?.bookingStatus !== "CONFIRMED"}
          >
            Update Booking Slot
          </MenuItem>

          <MenuItem
            onClick={handleRemoveFromList}
            disabled={booking?.bookingStatus !== "SUCCESS" && booking?.bookingStatus !== "CANCELLED"}
          >
            Remove from List
          </MenuItem>

          <MenuItem
            onClick={handleCompleteBooking}
            disabled={booking?.bookingStatus !== "PENDING"}
          >
            Complete Booking
          </MenuItem>

          <MenuItem
            onClick={handleCancelBooking}
            disabled={
              booking?.bookingStatus !== "CONFIRMED" &&
              booking?.bookingStatus !== "PENDING"
            }
          >
            Cancel Booking
          </MenuItem>

          {/* ✅ NEW Refund Option */}
          <MenuItem
            onClick={handleRefundBooking}
            disabled={
              booking?.bookingStatus !== "CANCELLED" || 
              booking?.bookingStatus === "REFUNDED"
            }
          >
            Refund Booking
          </MenuItem>

        </Menu>
      </div>

      {/* Card Body */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-5">
        <div className="space-y-2 w-full pr-4">
          <h1 className="text-2xl font-bold">{booking?.clinic?.name}</h1>
          <p className="text-gray-500">{booking?.clinic?.address}</p>

          <div>
            {booking?.services?.map((service) => (
              <li key={service?.id}>
                {service?.name}{" "}
                <span className="text-sm text-gray-500">
                  ({service?.categoryDto?.name})
                </span>
              </li>
            ))}
          </div>

          <div>
            <p className="font-semibold">
              Time & Date <ArrowRightAltIcon />{" "}
              {booking?.startTime?.split("T")[0] || ""}
            </p>
            <p className="text-slate-700">
              {booking?.startTime?.split("T")[1] || ""} To{" "}
              {booking?.endTime?.split("T")[1] || ""}
            </p>
          </div>
        </div>

        {/* Service Image & Status */}
        <div className="space-y-2 text-center mt-3 md:mt-0">
          <img
            className="h-28 w-28 object-cover rounded"
            src={booking?.services?.[0]?.image || ""}
            alt="service"
          />
          <p className="font-semibold">₹{booking?.totalPrice}</p>
          <p
            className={`font-bold uppercase ${getStatusColor(
              booking?.bookingStatus
            )}`}
          >
            {booking?.bookingStatus}
          </p>
        </div>
      </div>

      {/* Update Booking Slot Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[400px] bg-white shadow-lg p-6 rounded-lg space-y-5">
          <h2 className="text-xl font-bold">Update Booking Slot</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: "100%" }}
              label="Select new date & time"
              onChange={(value) => {
                if (value) {
                  const formattedDate = value.format("YYYY-MM-DDTHH:mm:ss");
                  setSelectedDateTime(formattedDate);
                }
              }}
            />
          </LocalizationProvider>
          <Button
            sx={{ py: ".7rem" }}
            fullWidth
            variant="contained"
            onClick={handleUpdateBookingSlot}
          >
            Update
          </Button>
        </div>
      </Modal>

      {/* Success Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={successPopup}
        autoHideDuration={3000}
        onClose={() => setSuccessPopup(false)}
      >
        <Alert
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Booking slot updated successfully!
        </Alert>
      </Snackbar>

      {/* Refund Form Modal */}
      <RefundForm
        open={openRefundModal}
        onClose={() => setOpenRefundModal(false)}
        onSubmit={handleRefundSubmit}
      />
    </div>
  );
};

export default BookingCard;
