import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";

const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    address: "",
    phone: "",
    gender: "",
    role: "",
    image: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.id || decoded.userId;
      if (userId) {
        fetchUserProfile();
      }
    }
  }, [token]);

  const fetchUserProfile = async () => {
  try {
    const res = await axios.get("http://localhost:1016/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = res.data;

    const nameParts = (user.fullName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setUserData({
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      userName: user.userName,
      password: user.password,
      role: user.role,
      address: user.address || "",
      phone: user.phone || "",
      gender: user.gender || "",
      image: user.image || "",
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullName = `${userData.firstName} ${userData.lastName}`;
      const payload = {
        fullName,
        address: userData.address,
        phone: userData.phone,
        gender: userData.gender,
        image: userData.image,
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      await axios.put(`http://localhost:1016/api/users/${userData.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile", error);
      setSnackbar({
        open: true,
        message: "Profile update failed",
        severity: "error",
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      setUserData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Update Profile
      </Typography>

      <Avatar src={userData.image} sx={{ width: 100, height: 100, mb: 2 }} />

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Upload Picture
        <input type="file" hidden onChange={handleImageChange} />
      </Button>

      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          value={userData.firstName}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          value={userData.lastName}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={userData.userName}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={userData.email}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={userData.password}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Role"
          fullWidth
          margin="normal"
          value={userData.role}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          value={userData.address}
          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
        />
        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
        />
        <TextField
          label="Gender"
          fullWidth
          margin="normal"
          value={userData.gender}
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Update Profile
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateProfile;
