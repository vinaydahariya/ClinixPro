import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomers,
  deleteUser
} from "../../../Redux/Auth/action"; // make sure getAllCustomers can fetch many items (page=0,size large)
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomerTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 8; // clinic used 8, using same

  // Dialog & Snackbar
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Redux customers (may be array or object depending on your reducer)
  const customersState = useSelector((state) => state.auth.customers);
  const loading = useSelector((state) => state.auth.isLoading || state.auth.loading);

  const jwt = localStorage.getItem("jwt");

  // Fetch all customers once (or after delete). Using a big size to simulate "fetch all".
  useEffect(() => {
    // try to fetch many items so we can paginate client-side like ClinicTable
    dispatch(getAllCustomers(jwt, 0, 1000));
  }, [dispatch, jwt]);

  // Normalize customers array:
  const allCustomers = React.useMemo(() => {
    
  if (!customersState) return [];
  let arr = [];
  if (Array.isArray(customersState)) arr = customersState;
  else if (customersState.content) arr = customersState.content;
  else return [];

  // Sort descending by createdAt (newest first)
  return arr.slice().sort((a, b) => {
    // parse dates for comparison (handle if createdAt is string or Date)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // newest first
  });
}, [customersState]);

console.log(allCustomers)


  // Client-side search (like ClinicTable)
  const filteredCustomers = React.useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return allCustomers;
    return allCustomers.filter((c) => {
      const name = (c.fullName || c.fullname || "").toString().toLowerCase();
      const email = (c.email || c.userName || "").toString().toLowerCase();
      const role = (c.role || "").toString().toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        role.includes(q)
      );
    });
  }, [allCustomers, searchTerm]);

  // Pagination calculations (client-side)
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / customersPerPage));
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleMenuClick = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    // navigate to update page with customer in state (UpdateProfile reads location.state.customer)
    navigate("/admin/user/update-profile", { state: { customer: selectedCustomer } });
  };

  const handleDelete = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setOpenDialog(false);
    try {
      await dispatch(deleteUser(selectedCustomer.id, jwt));
      setSnackbarOpen(true);
      // refresh list after delete
      await dispatch(getAllCustomers(jwt, 0, 1000));
      // keep same currentPage if possible, else adjust
      const newTotalPages = Math.max(1, Math.ceil((filteredCustomers.length - 1) / customersPerPage));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // client-side search only — no dispatch required (we fetched all)
    // if you prefer server search, replace with dispatch(searchUsersByName(...))
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Customers List", 14, 15);

    const tableColumn = ["Name", "Email", "Phone", "Address", "Role"];
    const tableRows = currentCustomers.map((c) => [
      c.fullName || c.fullname || "-",
      c.email || c.userName || "-",
      c.phone || c.mobile || "-",
      c.address || "-",
      c.role || "-"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("customers.pdf");
  };

  return (
    <div className="p-4">
      {/* Top bar: Download left, Search right (Clinic style) */}
      <div className="flex justify-between mb-4">
        <Button variant="outlined" onClick={handleDownloadPDF}>
          Download PDF
        </Button>

        <div className="flex">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "8px", width: "220px" }}
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

      {/* Loading */}
      {loading && <p>Loading customers...</p>}

      {/* Table */}
      {!loading && (
        <table className="w-full border-collapse">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  No customers found
                </td>
              </tr>
            ) : (
              currentCustomers.map((cust) => (
                <tr key={cust.id} className="border-b border-gray-200">
                  <td className="p-2">{cust.fullName}</td>
                  <td className="p-2">{cust.email}</td>
                  <td className="p-2">{cust.phone || cust.mobile}</td>
                  <td className="p-2">{cust.address}</td>
                  <td className="p-2">{cust.role}</td>
                  <td className="p-2 text-center">
                    <IconButton onClick={(e) => handleMenuClick(e, cust)}>
                      <MoreVertIcon />
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit Customer</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Customer</MenuItem>
      </Menu>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedCustomer?.fullName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          ✅ {selectedCustomer?.fullName} deleted successfully!
        </Alert>
      </Snackbar>

      {/* Pagination (Clinic style) */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CustomerTable;
