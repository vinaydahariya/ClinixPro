import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClinics,
  searchClinic,
  deleteClinic,
} from "../../../Redux/Clinic/action";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ClinicTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clinics, loading, error } = useSelector((state) => state.clinic);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = 8;

  // Dialog & Snackbar states
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClinics());
  }, [dispatch]);

  const handleMenuClick = (event, clinic) => {
    setAnchorEl(event.currentTarget);
    setSelectedClinic(clinic);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
  handleMenuClose();
  navigate(`/admin/clinic/update-clinic/${selectedClinic.id}`);
};

  const handleDelete = () => {
    handleMenuClose();
    setOpenDialog(true); // open confirmation dialog
  };

  const confirmDelete = () => {
    const jwt = localStorage.getItem("jwt");
    dispatch(deleteClinic(selectedClinic.id, jwt)).then(() => {
      setSnackbarOpen(true); // show success
      dispatch(fetchClinics()); // refresh list
    });
    setOpenDialog(false);
  };

  const handleSearch = () => {
    const jwt = localStorage.getItem("jwt");
    if (searchTerm.trim() === "") {
      dispatch(fetchClinics());
    } else {
      dispatch(searchClinic({ jwt, city: searchTerm }));
    }
    setCurrentPage(1);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Clinic List", 14, 15);

    const tableColumn = ["Name", "Owner ID", "Email", "Phone", "Address"];
    const tableRows = clinics.map((clinic) => [
      clinic.name,
      clinic.ownerId,
      clinic.email,
      clinic.phoneNumber,
      clinic.address,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("clinics.pdf");
  };

  // Pagination
  const totalPages = Math.ceil(clinics.length / clinicsPerPage);
  const indexOfLast = currentPage * clinicsPerPage;
  const indexOfFirst = indexOfLast - clinicsPerPage;
  const currentClinics = clinics.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-4">
      {/* Search + Download */}
      <div className="flex justify-between mb-4">
        <Button variant="outlined" onClick={handleDownloadPDF}>
          Download 
        </Button>
        <div className="flex">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "8px", width: "200px" }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ minWidth: "40px", padding: "6px" }}
            onClick={handleSearch}
          >
            <SearchIcon />
          </Button>
        </div>
      </div>

      {loading && <p>Loading clinics...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Owner ID</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentClinics.map((clinic) => (
              <tr key={clinic.id} className="border-b border-gray-200">
                <td className="p-2">{clinic.name}</td>
                <td className="p-2">{clinic.ownerId}</td>
                <td className="p-2">{clinic.email}</td>
                <td className="p-2">{clinic.phoneNumber}</td>
                <td className="p-2">{clinic.address}</td>
                <td className="p-2 text-center">
                  <IconButton onClick={(e) => handleMenuClick(e, clinic)}>
                    <MoreVertIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx + 1}
            variant={currentPage === idx + 1 ? "contained" : "outlined"}
            size="small"
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit Clinic</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Clinic</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedClinic?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          ✅ Clinic deleted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClinicTable;
