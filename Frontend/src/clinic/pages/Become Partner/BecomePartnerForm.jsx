import { Alert, Button, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

import SellerAccountForm from "./ClinicForm";

const BecomePartner = () => {

  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <div className="grid md:gap-10 grid-cols-3 min-h-screen ">
      <section className="lg:col-span-1 md:col-span-2 col-span-3 p-10 shadow-lg rounded-b-md flex flex-col items-center justify-center ">
        <SellerAccountForm /> 
       
      </section>
      <section className=" hidden md:col-span-1 md:flex  lg:col-span-2  justify-center items-center">
        <div className="lg:w-[70%] px-5 space-y-10">
          <div className="borderr rounded-md space-y-2 font-bold text-center">
            <p className=" text-2xl">Join the Marketplace Revolution</p>
            <p className="text-lg text-teal-500"> Boost Your Sales Today</p>
          </div>

          <img className="" src={"/seller.jpg"} alt="" />
          {/* <div>
                <p className=" logo absolute p-6 rounded-t-full text-white text-center top-0 left-16 right-11 bg-teal-500">Zosh Bazaar</p>
            </div> */}
        </div>
      </section>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={true ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {" otp sent to your email!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BecomePartner;
