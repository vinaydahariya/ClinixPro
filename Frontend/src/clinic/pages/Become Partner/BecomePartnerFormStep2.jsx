import React, { useState } from "react";
import { Box, CircularProgress, IconButton, Stack, TextField } from "@mui/material";
import {
  LocalizationProvider,
  MobileTimePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { AddPhotoAlternate, Close } from "@mui/icons-material";

const BecomePartnerFormStep3 = ({ formik }) => {
  const [uploadImage, setUploadingImage] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("clinicDetails.images", [
      ...formik.values.clinicDetails.images,
      image,
    ]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.clinicDetails.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("clinicDetails.images", updatedImages);
  };

  return (
    <Box className="space-y-5">
      <div className="flex flex-wrap gap-5">
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <label className="relative" htmlFor="fileInput">
          <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
            <AddPhotoAlternate className="text-gray-700" />
          </span>
          {uploadImage && (
            <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
              <CircularProgress />
            </div>
          )}
        </label>

        <div className="flex flex-wrap gap-2">
          {formik.values?.clinicDetails?.images.map((image, index) => (
            <div className="relative" key={index}>
              <img
                className="w-24 h-24 object-cover"
                src={image}
                alt={`ProductImage ${index + 1}`}
              />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                size="small"
                color="error"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  outline: "none",
                }}
              >
                <Close sx={{ fontSize: "1rem" }} />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <TextField
        fullWidth
        name="clinicDetails.name"
        label="Clinic Name"
        value={formik.values.clinicDetails.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {/* ✅ Description Field */}
      <TextField
        fullWidth
        name="clinicDetails.description"
        label="Clinic Description"
        multiline
        rows={4}
        value={formik.values.clinicDetails.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <TimePicker
            label="Open Time"
            onChange={(newValue) => {
              if (newValue) {
                formik.setFieldValue("clinicDetails.openTime", newValue);
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <MobileTimePicker
            label="Close Time"
            onChange={(newValue) => {
              formik.setFieldValue("clinicDetails.closeTime", newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
    </Box>
  );
};

export default BecomePartnerFormStep3;
