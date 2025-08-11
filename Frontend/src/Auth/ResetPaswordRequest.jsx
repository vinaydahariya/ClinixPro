import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  CssBaseline,
  Container,
  Backdrop,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ResetPasswordRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = (values) => {
    console.log("Reset link requested for:", values.email);

    // Simulate link sending
    setTimeout(() => {
      setLinkSent(true);
    }, 1000);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography className="text-center" variant="h5">
            Forgot Password
          </Typography>
          {!linkSent ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  name="email"
                  id="email"
                  autoComplete="email"
                  helperText={<ErrorMessage name="email" />}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, padding: "1rem" }}
                >
                  Send Reset Password Link
                </Button>
              </Form>
            </Formik>
          ) : (
            <div style={{ marginTop: "20px" }}>
              <Alert severity="success">
                A reset password link has been sent to your email (simulation).
              </Alert>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, padding: "0.8rem" }}
                onClick={() => navigate("/reset-password-form?token=dummy123")}
              >
                👉 Click here to open Reset Password Form
              </Button>
            </div>
          )}
        </div>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={auth.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ResetPasswordRequest;
