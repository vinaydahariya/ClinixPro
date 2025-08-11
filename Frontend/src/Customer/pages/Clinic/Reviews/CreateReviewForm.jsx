import React, { useState } from "react";
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
import { createReview } from "../../../../Redux/Review/action";
import { useParams, useNavigate } from "react-router-dom"; 

const CreateReviewForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      reviewText: "",
      reviewRating: null,
    },
    validationSchema: Yup.object({
      reviewText: Yup.string()
        .required("Review text is required")
        .min(10, "Review must be at least 10 characters long"),
      reviewRating: Yup.number()
        .required("Rating is required")
        .min(0.5, "Rating must be at least 0.5")
        .max(5, "Rating cannot be more than 5"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const token = localStorage.getItem("jwt");

      // ✅ Redirect if user not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      if (id) {
        try {
          await dispatch(
            createReview({
              reviewData: {
                reviewText: values.reviewText,
                rating: values.reviewRating,
              },
              clinicId: id,
              jwt: token,
            })
          );
          setOpenSnackbar(true); // ✅ Show success message
          resetForm(); // ✅ Clear form after submit
        } catch (error) {
          console.log("Error creating review:", error);
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
          label="Review Text"
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
          Submit Review
        </Button>
      </Box>

      {/* ✅ Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Review created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateReviewForm;
