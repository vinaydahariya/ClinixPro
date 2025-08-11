import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Rating,
  InputLabel,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateReview } from "../../../../Redux/Review/action";

const UpdateReviewForm = ({ reviewData, onClose }) => {
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      reviewText: reviewData?.reviewText || "",
      reviewRating: reviewData?.rating || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      reviewText: Yup.string()
        .required("Review text is required")
        .min(10, "Review must be at least 10 characters long"),
      reviewRating: Yup.number()
        .required("Rating is required")
        .min(0.5, "Rating must be at least 0.5")
        .max(5, "Rating cannot be more than 5"),
    }),
    onSubmit: async (values) => {
      if (reviewData?.id) {
        try {
          await dispatch(
            updateReview({
              reviewId: reviewData.id,
              reviewData: {
                reviewText: values.reviewText,
                rating: values.reviewRating,
              },
              jwt: localStorage.getItem("jwt"),
            })
          );
          setOpenSnackbar(true); // ✅ Show success
          setTimeout(() => {
            if (onClose) onClose(); // ✅ Close modal after short delay
          }, 1000);
        } catch (error) {
          console.log("Error updating review:", error);
        }
      }
    },
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{ mt: 3 }}
        className="space-y-5 w-full lg:w-1/2"
      >
        <TextField
          fullWidth
          id="reviewText"
          name="reviewText"
          label="Update Review"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.reviewText}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
          helperText={formik.touched.reviewText && formik.errors.reviewText}
        />

        <div className="space-y-2">
          <InputLabel>Rating</InputLabel>
          <Rating
            id="reviewRating"
            name="reviewRating"
            value={formik.values.reviewRating}
            onChange={(event, newValue) => {
              formik.setFieldValue("reviewRating", Number(newValue));
            }}
            precision={0.5}
          />
        </div>

        {formik.touched.reviewRating && formik.errors.reviewRating && (
          <Typography color="error" variant="body2">
            {formik.errors.reviewRating}
          </Typography>
        )}

        <Button color="primary" variant="contained" type="submit">
          Update Review
        </Button>
      </Box>

      {/* ✅ Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
           Review updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateReviewForm;
