import React, { useState } from "react";
import { Modal, Button, TextField, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SettlementForm = ({ open, onClose }) => {
  const [upiId, setUpiId] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accHolder, setAccHolder] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!upiId && (!accNumber || !ifsc || !accHolder)) {
      alert("Please enter UPI ID or all bank details");
      return;
    }
    onClose();
    navigate("/clinic-dashboard/settlement-success");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] bg-white shadow-lg p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold text-center">Settlement Request</h2>

        <TextField
          label="UPI ID"
          fullWidth
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />

        <Divider>OR</Divider>

        <TextField
          label="Account Number"
          fullWidth
          value={accNumber}
          onChange={(e) => setAccNumber(e.target.value)}
        />
        <TextField
          label="IFSC Code"
          fullWidth
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
        />
        <TextField
          label="Account Holder Name"
          fullWidth
          value={accHolder}
          onChange={(e) => setAccHolder(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default SettlementForm;
