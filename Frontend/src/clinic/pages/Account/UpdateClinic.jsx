import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { updateClinic } from "../../../Redux/Clinic/action";
import { useNavigate } from "react-router-dom";

const UpdateClinic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clinic } = useSelector((store) => store);
  const clinicData = clinic.clinic;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    city: "",
    openTime: "",
    closeTime: "",
  });

  useEffect(() => {
    if (clinicData) {
      setFormData({
        name: clinicData.name || "",
        address: clinicData.address || "",
        phoneNumber: clinicData.phoneNumber || "",
        email: clinicData.email || "",
        city: clinicData.city || "",
        openTime: clinicData.openTime || "",
        closeTime: clinicData.closeTime || "",
      });
    }
  }, [clinicData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTimeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value.format("HH:mm:ss"),
    }));
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...clinicData,
      ...formData,
    };

    await dispatch(updateClinic(clinicData.id, updatedData));
    navigate("/clinic-dashboard/account");
  };

  return (
    <Box className="lg:px-20 py-10 space-y-6 max-w-2xl mx-auto">
      <Typography variant="h4" fontWeight={600}>
        Update Clinic Details
      </Typography>

      <TextField
        fullWidth
        label="Clinic Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={2} direction="row">
          <TimePicker
            label="Open Time"
            value={formData.openTime ? dayjs(formData.openTime, "HH:mm:ss") : null}
            onChange={(val) => handleTimeChange("openTime", val)}
          />
          <TimePicker
            label="Close Time"
            value={formData.closeTime ? dayjs(formData.closeTime, "HH:mm:ss") : null}
            onChange={(val) => handleTimeChange("closeTime", val)}
          />
        </Stack>
      </LocalizationProvider>

      {/* Display Image URLs or names */}
      <Box>
        <Typography fontWeight={600} mt={2}>
          Clinic Images:
        </Typography>
        {clinicData?.images?.length > 0 ? (
          clinicData.images.map((img, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {img}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No images available
          </Typography>
        )}
      </Box>

      {/* Owner ID - Read-only */}
      <TextField
        fullWidth
        label="Owner ID"
        value={clinicData?.ownerId || ""}
        disabled
      />

      <Button variant="contained" onClick={handleSubmit}>
        Update
      </Button>
    </Box>
  );
};

export default UpdateClinic;
