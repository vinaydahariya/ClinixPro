import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  searchBookings,
} from "../../../Redux/Booking/action";

// ✅ Status sorting priority
const statusPriority = {
  CONFIRMED: 1,
  SUCCESS: 2,
  CANCELLED: 3,
  PENDING: 4,
  REFUNDED: 5,
};

const Report = () => {
  const dispatch = useDispatch();
  const { bookings, totalPages } = useSelector((state) => state.booking);
  const jwt = localStorage.getItem("jwt");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  // ✅ Fetch bookings on load & when search/page changes
  useEffect(() => {
    if (search.trim() === "") {
      dispatch(fetchAllBookings({ jwt, page, size: itemsPerPage }));
    } else {
      dispatch(
        searchBookings({ jwt, fullName: search, page, size: itemsPerPage })
      );
    }
  }, [dispatch, jwt, search, page]);

  // ✅ Search handler
  const handleSearch = () => {
    setPage(0);
    if (search.trim() === "") {
      dispatch(fetchAllBookings({ jwt, page: 0, size: itemsPerPage }));
    } else {
      dispatch(
        searchBookings({ jwt, fullName: search, page: 0, size: itemsPerPage })
      );
    }
  };

  // ✅ PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Bookings Report", 14, 10);
    autoTable(doc, {
      head: [["Booking ID", "User", "Clinic", "Created At", "Amount", "Status"]],
      body: bookings.map((r) => [
        r.id,
        r.user?.fullName || "N/A",
        r.clinic?.name || "N/A",
        r.createdAt?.split("T")[0],
        `₹${r.amount || 0}`,
        r.status,
      ]),
    });
    doc.save("reports.pdf");
  };

  // ✅ Sorted bookings list
  const sortedBookings = [...bookings].sort((a, b) => {
    const priorityA = statusPriority[a.bookingStatus] || 99;
    const priorityB = statusPriority[b.bookingStatus] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // Priority wise sort
    }

    const dateA = new Date(a.createdAt).getTime() || 0;
    const dateB = new Date(b.createdAt).getTime() || 0;
    return dateB - dateA; // Latest first
  });

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outlined" onClick={handleDownloadPDF}>
          Download
        </Button>
        <div className="flex items-center space-x-2">
          <TextField
            size="small"
            placeholder="Search by user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{ width: 200 }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "black" }}>
              <TableCell style={{ color: "white" }}>Booking ID</TableCell>
              <TableCell style={{ color: "white" }}>User</TableCell>
              <TableCell style={{ color: "white" }}>Clinic</TableCell>
              <TableCell style={{ color: "white" }}>Created At</TableCell>
              <TableCell style={{ color: "white" }}>Amount</TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBookings.length > 0 ? (
              sortedBookings.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    {r.userDto?.fullName || r.userDto?.name || r.userName || "N/A"}
                  </TableCell>

                  <TableCell>
                    {r.clinic?.name || r.clinicName || "N/A"}
                  </TableCell>
                  <TableCell>{r.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>₹{r.totalPrice || 0}</TableCell>
                  <TableCell
                    className="p-2 font-bold"
                    style={{
                      color:
                        r.bookingStatus === "CONFIRMED"
                          ? "green"
                          : r.bookingStatus === "SUCCESS"
                          ? "blue"
                          : r.bookingStatus === "PENDING"
                          ? "goldenrod"
                          : r.bookingStatus === "REFUNDED"
                          ? "black"
                          : "red",
                    }}
                  >
                    {r.bookingStatus}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outlined"
          size="small"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={page === idx ? "contained" : "outlined"}
            size="small"
            onClick={() => setPage(idx)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outlined"
          size="small"
          disabled={page === totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Report;
