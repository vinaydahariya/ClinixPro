import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ProfileFildCard from "./ProfileFildCard";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { updateClinic } from "../../../Redux/Clinic/action"; // ✅ make sure this exists

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const { clinic, auth } = useSelector((store) => store);
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState("persionalDetails");
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleOpen = (formName) => {
    setOpen(true);
    setSelectedForm(formName);
  };

  const renderSelectedForm = () => {
    switch (selectedForm) {
      default:
        return null;
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleUpdateOwnerDetails = () => {
    navigate("/update-profile");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const image = await uploadToCloudinary(file);

      const updatedImages = [...(clinic.clinic?.images || []), image];

      await dispatch(
        updateClinic(clinic.clinic?.id, {
          ...clinic.clinic,
          images: updatedImages,
        })
      );

      setOpenSnackbar(true);
    } catch (error) {
      console.error("Image Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    const updatedImages = (clinic.clinic?.images || []).slice(1);

    dispatch(
      updateClinic(clinic.clinic?.id, {
        ...clinic.clinic,
        images: updatedImages,
      })
    );

    setOpenSnackbar(true);
  };

  return (
    <div className="lg:px-20 lg:pb-20 space-y-20">
      <div className="w-full lg:w-[70%]">
        <h1 className="text-5xl font-bold pb-5">{clinic.clinic?.name}</h1>

        <div className="grid grid-cols-2 mb-5 gap-3">
          <div className="col-span-2 relative">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src={clinic.clinic?.images?.[0]}
              alt=""
            />
          </div>
          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src={clinic.clinic?.images?.[1]}
              alt=""
            />
          </div>
          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src={clinic.clinic?.images?.[2]}
              alt=""
            />
          </div>
        </div>

        {/* Upload/Remove image buttons */}
        <div className="flex gap-3 mb-10 items-center">
          <Button variant="contained" component="label">
            {uploading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Upload Image"
            )}
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <Button variant="outlined" color="error" onClick={handleRemoveImage}>
            Remove Image
          </Button>
        </div>

        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">
            Owner Details
          </h1>
        </div>
        <div className="space-y-0">
          <ProfileFildCard
            keys={"Owner Name"}
            value={auth.user?.fullName}
          />
          <Divider />
          <ProfileFildCard keys={"Owner Email"} value={auth.user?.email} />
          <Divider />
          <ProfileFildCard keys={"Role"} value={"CLINIC_OWNER"} />
        </div>

        {/* Update Owner Button */}
        <div className="mt-4">
          <Button variant="contained" onClick={handleUpdateOwnerDetails}>
            Update Owner Details
          </Button>
        </div>
      </div>

      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Clinic Details</h1>
        </div>

        <div className="flex flex-col divide-y divide-gray-200">
          <ProfileFildCard keys={"Clinic Name"} value={clinic.clinic?.name} />
          <ProfileFildCard
            keys={"Clinic Address"}
            value={clinic.clinic?.address || "not provided"}
          />
          <ProfileFildCard keys={"Open Time"} value={clinic.clinic?.openTime} />
          <ProfileFildCard keys={"Close Time"} value={clinic.clinic?.closeTime} />
        </div>

        {/* Update Clinic Button */}
        <div className="mt-6">
          <Button
            variant="contained"
            onClick={() => navigate("/clinic-dashboard/update-clinic")}
          >
            Update Clinic Details
          </Button>
        </div>

      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderSelectedForm()}</Box>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={clinic.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {clinic.error ? clinic.error : "Profile Updated Successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
