import React from "react";
import { Grid2, TextField } from "@mui/material";



const BecomePartnerFormStep2 = ({ formik }) => {
  return (
    <div>
      <Grid2 container spacing={3}>
       
        <Grid2 size={6}>
          <TextField
            fullWidth
            name="clinicAddress.phoneNumber"
            label="Mobile"
            value={formik.values?.clinicAddress.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            fullWidth
            name="clinicAddress.pincode"
            label="Pincode"
            value={formik.values?.clinicAddress.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pickupAddress?.pincode && Boolean(formik.errors.pickupAddress?.pincode)}
            helperText={formik.touched.pickupAddress?.pincode && formik.errors.pickupAddress?.pincode}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            name="clinicAddress.address"
            label="Address (House No, Building, Street)"
            value={formik.values?.clinicAddress.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
            helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
          />
        </Grid2>
       
        <Grid2 size={12}>
          <TextField
            fullWidth
            name="clinicAddress.city"
            label="City"
            value={formik.values?.clinicAddress.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
            helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            name="clinicAddress.email"
            label="Email"
            value={formik.values?.clinicAddress.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pickupAddress?.email && Boolean(formik.errors.pickupAddress?.email)}
            helperText={formik.touched.pickupAddress?.email && formik.errors.pickupAddress?.email}
          />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default BecomePartnerFormStep2;
