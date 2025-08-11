import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Box, Button, IconButton, Modal, Snackbar, styled } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesByClinicId } from "../../../Redux/Clinic Services/action";
import { Delete } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import UpdateServiceForm from "./UpdateClinicServiceForm";
import { deleteService } from "../../../Redux/Clinic Services/action";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ServicesTable() {
  const { clinic, service } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const [snackbarOpen, setOpenSnackbar] = React.useState(false);
    const [openUpdateServiceForm, setUpdateServiceForm] = React.useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);

    const handleOpenUpdateServiceForm = (id) => () => {
      navigate(`/clinic-dashboard/services/${id}`);
      setUpdateServiceForm(true);
    };
    const handleCloseUpdateServiceForm = () => setUpdateServiceForm(false);

    const handleDeleteService = (id) => {
      setConfirmDeleteId(id); // 🟢 Show modal for this id
    };

    const confirmDelete = () => {
      const jwt = localStorage.getItem("jwt");
      dispatch(deleteService(confirmDeleteId, jwt));
      setConfirmDeleteId(null); // ❌ Close modal
    };

    const cancelDelete = () => {
      setConfirmDeleteId(null); // ❌ Close modal
    };



  
    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };
    React.useEffect(() => {
      if (service.updated || service.error) {
        setOpenSnackbar(true);
      }
    }, [service.updated, service.error]);

  React.useEffect(() => {
    if (clinic.clinic?.id) {
      dispatch(
        fetchServicesByClinicId({
          clinicId: clinic.clinic?.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [clinic.clinic]);

  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Services</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
  <TableRow>
    <StyledTableCell>Image</StyledTableCell>
    <StyledTableCell align="right">Title</StyledTableCell>
    <StyledTableCell align="right">PRICE</StyledTableCell>
    <StyledTableCell align="right">Update</StyledTableCell>
    <StyledTableCell align="right">Delete</StyledTableCell> {/* ✅ Move here only heading */}
  </TableRow>
</TableHead>
<TableBody>
  {service.services.map((item) => (
    <StyledTableRow key={item.id}>
      <StyledTableCell component="th" scope="row">
        <div className="flex gap-1 flex-wrap">
          <img className="w-20 rounded-md" src={item.image} alt="" />
        </div>
      </StyledTableCell>
      <StyledTableCell align="right">{item.name}</StyledTableCell>
      <StyledTableCell align="right">₹{item.price}.0</StyledTableCell>
      <StyledTableCell align="right">
        <IconButton
          onClick={handleOpenUpdateServiceForm(item.id)}
          color="primary"
          className="bg-primary-color"
        >
          <EditIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell align="right">
        <IconButton
          onClick={() => handleDeleteService(item.id)} // 🟢 triggers modal open
  color="error"
        >
          <Delete />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      <Modal
        open={openUpdateServiceForm}
        onClose={handleCloseUpdateServiceForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateServiceForm onClose={handleCloseUpdateServiceForm} />
        </Box>
      </Modal>
      <Modal open={!!confirmDeleteId} onClose={cancelDelete}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 350,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <h3 className="text-lg font-bold mb-3">Confirm Delete</h3>
    <p className="mb-4">Are you sure you want to delete this service?</p>
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
      <Button variant="contained" color="error" onClick={confirmDelete}>
        Delete
      </Button>
      <Button variant="outlined" onClick={cancelDelete}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={service.updated ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {service.updated
            ? "category updated successfully"
            : service.error
            ? service.error?.response?.data?.message
            : ""}
        </Alert>
      </Snackbar>
    </>
  );
}
