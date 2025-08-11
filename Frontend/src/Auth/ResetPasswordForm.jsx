import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Container, Paper, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirmed password is required"),
});

function ResetPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const initialValues = {
    password: "",
    confirmedPassword: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    if (values.password === values.confirmedPassword) {
      console.log("yes its working....");
      navigate("/password-change-success");
    }
    const data = { password: values.password, token };
    // dispatch(resetPassword({ navigate, data }));
    setSubmitting(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{ padding: 4, mt: 10, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Reset Your Password
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Box mb={3}>
              <Field
                as={TextField}
                name="password"
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
              />
            </Box>
            <Box mb={3}>
              <Field
                as={TextField}
                name="confirmedPassword"
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage
                name="confirmedPassword"
                component="div"
                style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
              />
            </Box>
            <Button
              sx={{ padding: "0.9rem 0rem", fontWeight: "bold", fontSize: "1rem" }}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              Reset Password
            </Button>
          </Form>
        </Formik>
      </Paper>
    </Container>
  );
}

export default ResetPasswordForm;
