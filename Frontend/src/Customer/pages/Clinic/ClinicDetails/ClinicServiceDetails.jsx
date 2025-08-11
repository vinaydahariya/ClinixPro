import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  fetchBookedSlots,
} from "../../../../Redux/Booking/action";
import { useParams, useLocation } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import { Alert, Button, Divider, Modal, Snackbar } from "@mui/material";
import { isServiceSelected } from "../../../../util/isServiceSelected";
import {
  ArrowRight,
  RemoveShoppingCart,
  ShoppingCart,
} from "@mui/icons-material";
import SelectedServiceList from "./SelectedServiceList";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchServicesByClinicId } from "../../../../Redux/Clinic Services/action";
import { getTodayDate } from "../../../../util/getTodayDate";

const ClinicServiceDetails = () => {
  const { clinic, service, category, booking } = useSelector((store) => store);
  const location = useLocation();
  const passedData = location.state?.bookingData;
  const passedClinicId = location.state?.clinicId;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [open, setOpen] = useState(false);  // ✅ Added state for Modal

  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Pre-filled data if coming from BookingCard
  const [bookingData, setBookingData] = useState({
    services: passedData?.services || [],
    time: passedData?.startTime || null,
  });

  const clinicId = id || passedClinicId;

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSelectService = (serviceItem) => {
    setBookingData((prev) => ({
      ...prev,
      services: [...prev.services, serviceItem],
    }));
  };

  const handleRemoveService = (sid) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== sid),
    }));
  };

  const handleSelectCategory = (cid) => () => {
    setSelectedCategory(cid);
  };

  const handleBooking = () => {
    const serviceIds = bookingData.services.map((service) => service.id);

    dispatch(
      createBooking({
        bookingData: { serviceIds, startTime: bookingData.time },
        clinicId: clinicId,
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  useEffect(() => {
    if (clinicId) {
      dispatch(
        fetchBookedSlots({
          clinicId: clinicId,
          date: bookingData.time?.split("T")[0] || getTodayDate(),
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [clinicId, bookingData.time]);

  useEffect(() => {
    if (clinicId) {
      dispatch(
        fetchServicesByClinicId({
          clinicId: clinicId,
          jwt: localStorage.getItem("jwt"),
          categoryId: selectedCategory,
        })
      );
    }
  }, [clinicId, selectedCategory]);

  useEffect(() => {
    if (booking.error) {
      setSnackbarOpen(true);
    }
  }, [booking.error]);

  return (
    <div className="lg:flex gap-5 h-[90vh] mt-10 ">
      {/* Category Section */}
      <section className="space-y-5 border-r lg:w-[25%] pr-5">
        <CategoryCard
          selectedCategory={selectedCategory}
          handleSelectCategory={handleSelectCategory}
          item={{
            id: null,
            name: "ALL",
            image: "/photos/homePage/services.jpg"
          }}
        />
        {category.categories.map((item) => (
          <CategoryCard
            key={item.id}
            selectedCategory={selectedCategory}
            handleSelectCategory={handleSelectCategory}
            item={item}
          />
        ))}
      </section>

      {/* Services Section */}
      <section className="space-y-2 lg:w-[50%] px-5 lg:px-20 overflow-y-auto">
        {service.services.map((item) => (
          <div key={item.id} className="space-y-4">
            <ServiceCard
              onRemove={handleRemoveService}
              onSelect={handleSelectService}
              service={item}
              isSelected={isServiceSelected(bookingData.services, item.id)}
            />
            <Divider />
          </div>
        ))}
      </section>

      {/* Selected Services Cart */}
      <section className="lg:w-[25%] ">
        <div className="border rounded-md p-5">
          {bookingData.services.length ? (
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart sx={{ fontSize: "30px", color: "green" }} />
                <h1 className="font-thin text-sm">Selected Services</h1>
              </div>

              <SelectedServiceList
                handleRemoveService={handleRemoveService}
                services={bookingData.services}
              />

              <Button
                onClick={() => setOpen(true)}
                sx={{ py: ".7rem" }}
                fullWidth
                variant="contained"
              >
                Book now
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center">
              <RemoveShoppingCart sx={{ fontSize: "30px", color: "green" }} />
              <h1>not selected</h1>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] bg-white shadow-lg p-4 lg:flex gap-5">
          <div className="w-[50%] border-r pr-5">
            <h1 className="text-xl font-bold">Time Slot Not Available</h1>
            <ul className="mt-5 space-y-2 font-semibold">
              {booking.slots?.length > 0 ? booking.slots.map((item) => (
                <li key={item.id}>
                  <ArrowRight /> {item.startTime?.split("T")[1]} To{" "}
                  {item.endTime?.split("T")[1]}
                </li>
              )) : <div className="flex justify-center items-center">
                <h1 className="text-primary-color">All Slots Are Available</h1></div>}
            </ul>
          </div>
          <div className="space-y-5">
            <SelectedServiceList
              handleRemoveService={handleRemoveService}
              services={bookingData.services}
            />
            <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ width: "100%" }}
                fullWidth
                onChange={(value) => {
                  if (value) {
                    const localDate = value.format("YYYY-MM-DDTHH:mm:ss");
                    setBookingData((prev) => ({ ...prev, time: localDate }));
                  }
                }}
                label="Select date & time"
              />
            </LocalizationProvider>
            <div>
              <Button
                sx={{ py: ".7rem" }}
                fullWidth
                variant="outlined"
                onClick={handleBooking}
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={"error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {booking.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClinicServiceDetails;
