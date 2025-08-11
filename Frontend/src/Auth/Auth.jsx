import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RegistrationForm from "./Register";
import LoginForm from "./Login";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordRequest from "./ResetPaswordRequest";



const Auth = ({ open, handleClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (auth.success || auth.error) setOpenSnackBar(true);
  }, [auth.success, auth.error]);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <div className="flex justify-center items-center h-[95vh]">
      <div className="shadow-xl p-5">
        {location.pathname === "/register" ? (
          <RegistrationForm />
        ) :  (
          <LoginForm />
        ) }
        <div className="flex justify-center mt-5">
          
          <Snackbar
            sx={{ zIndex: 50 }}
            open={openSnackBar}
            autoHideDuration={3000}
            onClose={handleCloseSnackBar}
            // handleClose={handleCloseSnackBar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              severity={auth.error ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {auth.success ||
                auth.error?.response?.data?.message ||
                auth.error?.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Auth;
