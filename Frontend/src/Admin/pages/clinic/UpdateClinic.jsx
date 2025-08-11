import React, { useEffect, useState } from "react";
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
import {
  updateClinic,
  fetchClinicById,
} from "../../../Redux/Clinic/action";
import { useNavigate, useParams } from "react-router-dom";

const UpdateClinic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clinic, auth } = useSelector((store) => store);
  const user = auth?.user || {};

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
    if (id) {
      dispatch(fetchClinicById(id));
    }
  }, [id, dispatch]);

  // Sirf editable fields ko formData me set kar
  useEffect(() => {
    if (clinic?.clinic) {
      setFormData({
        name: clinic.clinic.name || "",
        address: clinic.clinic.address || "",
        phoneNumber: clinic.clinic.phoneNumber || "",
        email: clinic.clinic.email || "",
        city: clinic.clinic.city || "",
        openTime: clinic.clinic.openTime || "",
        closeTime: clinic.clinic.closeTime || "",
      });
    }
  }, [clinic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value ? value.format("HH:mm:ss") : "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData) return;

    // Pura clinic object leke formData ke saath merge kar
    const updatedData = {
      ...clinic.clinic, // ownerId, images, id, etc. baki fields
      ...formData,      // form se edited fields
    };

    await dispatch(updateClinic(clinic.clinic.id, updatedData));
    navigate("/admin/clinic");
  };

  if (!clinic?.clinic) {
    return <Typography>Loading clinic details...</Typography>;
  }

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
        <Stack spacing={2} direction="row" mt={2} mb={2}>
          <TimePicker
            label="Open Time"
            value={formData.openTime ? dayjs(formData.openTime, "HH:mm:ss") : null}
            onChange={(val) => handleTimeChange("openTime", val)}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            label="Close Time"
            value={formData.closeTime ? dayjs(formData.closeTime, "HH:mm:ss") : null}
            onChange={(val) => handleTimeChange("closeTime", val)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>

      <Box>
        <Typography fontWeight={600} mt={2}>
          Clinic Images:
        </Typography>
        {clinic.clinic.images?.length > 0 ? (
          clinic.clinic.images.map((img, i) => (
            <Typography key={i} variant="body2" color="text.secondary">
              {img}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No images available
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        label="Owner ID"
        value={clinic.clinic.ownerId || ""}
        disabled
        sx={{ mt: 2 }}
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default UpdateClinic;
