import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Auth/action";

// ✅ Icons
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (values) => {
    console.log("Login form values:", values);
    try {
      const response = await dispatch(loginUser({ data: values, navigate }));

      // ✅ agar success me token mila to error hata do
      if (response?.payload?.access_token) {
        setLoginError(false);
      } else {
        // ✅ forcefully show reset password link on any login failure
        setLoginError(true);
      }
    } catch (err) {
      console.error("Login error =>", err);
      setLoginError(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography className="text-center" variant="h5">
          Login
        </Typography>
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
            <Field
              as={TextField}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={<ErrorMessage name="password" />}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, padding: "1rem" }}
            >
              Login
            </Button>
          </Form>
        </Formik>

        {/* ✅ Show reset password link if login failed */}
        {loginError && (
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, color: "red" }}
          >
            Invalid credentials.{" "}
            <Button onClick={() => navigate("/reset-password-request")}>
              Reset Password?
            </Button>
          </Typography>
        )}

        {/* ✅ Login with Google and Facebook */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<GoogleIcon />}
            onClick={() => alert("Google login backend pending")}
          >
            Login with Google
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FacebookIcon />}
            onClick={() => alert("Facebook login backend pending")}
          >
            Login with Facebook
          </Button>
        </div>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Button onClick={() => navigate("/register")}>
            Register
          </Button>
        </Typography>
      </div>
    </Container>
  );
};

export default LoginForm;
