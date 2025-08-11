import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createClinic } from "../../../Redux/Clinic/action";
import { useNavigate } from "react-router-dom";
import BecomePartnerFormStep1 from "./BecomePartnerFormStep1";
import BecomePartnerFormStep2 from "./BecomePartnerFormStep3";
import BecomePartnerFormStep3 from "./BecomePartnerFormStep2";

const steps = ["Owner Details", "Clinic Details", "Clinic Address"];

const ClinicForm = () => {
  const { auth } = useSelector((store) => store);
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Split full name
  const fullName = auth.user?.fullName || "";
  const [firstName, ...lastParts] = fullName.split(" ");
  const lastName = lastParts.join(" ");

  useEffect(() => {
    if (auth.user) {
      setActiveStep(1); // ✅ skip step 1 if user logged in
    }
  }, [auth.user]);

  const formik = useFormik({
    initialValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: auth.user?.email || "",
      password: auth.user?.password || "", // ✅ actual password
      clinicAddress: {
        phoneNumber: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
        email: "", // ✅ blank, user email not auto-filled
      },
      clinicDetails: {
        name: "",
        description: "",
        openTime: "",
        closeTime: "",
        images: [],
      },
    },
    onSubmit: (values) => {
      const openTime = getLocalTime(values.clinicDetails.openTime);
      const closeTime = getLocalTime(values.clinicDetails.closeTime);

      // ✅ Don't set role here; backend handles it after successful clinic creation
      const ownerDetails = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        username: values.email.split("@")[0],
      };

      const clinicDetails = {
        ...values.clinicDetails,
        openTime,
        closeTime,
        ...values.clinicAddress,
      };

      dispatch(createClinic({ ownerDetails, clinicDetails, navigate }));
    },
  });

  const handleStep = (value) => {
    setActiveStep(activeStep + value);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const getLocalTime = (time) => {
    if (!time) return "";
    let hour = time?.$H;
    let minute = time.$m;
    let second = time.$s;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}:${String(second).padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 space-y-10">
        <div>
          {activeStep === 0 ? (
            <BecomePartnerFormStep1
              formik={formik}
              isReadOnly={!!auth.user}
            />
          ) : activeStep === 1 ? (
            <BecomePartnerFormStep3 formik={formik} />
          ) : (
            <BecomePartnerFormStep2 formik={formik} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            disabled={activeStep === 0}
            onClick={() => handleStep(-1)}
            variant="contained"
          >
            Back
          </Button>
          <Button
            onClick={
              activeStep === steps.length - 1
                ? handleSubmit
                : () => handleStep(1)
            }
            variant="contained"
          >
            {activeStep === steps.length - 1
              ? "Create Account"
              : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClinicForm;
