import React, { useEffect, useState, useMemo } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  searchBookings,
  deleteBooking,
  updateBookingStatus,
} from "../../../Redux/Booking/action";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BookingTable = () => {
  const dispatch = useDispatch();
  const { bookings, totalPages, loading } = useSelector(
    (state) => state.booking
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [hiddenBookings] = useState([]);



const filteredBookings = useMemo(() => {
  if (!bookings || bookings.length === 0) return [];
  
  return [...bookings]
    .filter(item => !hiddenBookings.includes(item.id))
    .sort((a, b) => {
      // ISO string ko timestamp mein convert karo (safe way)
      const timeA = a.createdAt ? new Date(a.createdAt) : 0;
      const timeB = b.createdAt ? new Date(b.createdAt) : 0;
      
      // DESCENDING (newest first)
      return timeB - timeA;
    });
}, [bookings, hiddenBookings]);


  // Fetch bookings or search on changes
  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(
        searchBookings({
          jwt: localStorage.getItem("jwt"),
          fullName: searchTerm,
          page: currentPage,
          size: rowsPerPage,
        })
      );
    } else {
      dispatch(
        fetchAllBookings({
          jwt: localStorage.getItem("jwt"),
          page: currentPage,
          size: rowsPerPage,
        })
      );
    }
  }, [dispatch, currentPage, rowsPerPage, searchTerm]);

  // Search handler
  const handleSearch = () => {
    setCurrentPage(0); // reset page on new search
    if (searchTerm.trim()) {
      dispatch(
        searchBookings({
          jwt: localStorage.getItem("jwt"),
          fullName: searchTerm,
          page: 0,
          size: rowsPerPage,
        })
      );
    } else {
      dispatch(
        fetchAllBookings({
          jwt: localStorage.getItem("jwt"),
          page: 0,
          size: rowsPerPage,
        })
      );
    }
  };

  // Menu handlers
  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  // Action Handlers
  const handleDeleteBooking = () => {
    if (!selectedBooking) return;
    const jwt = localStorage.getItem("jwt");
    dispatch(deleteBooking(selectedBooking.id));
    handleMenuClose();
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedBooking) return;
    const jwt = localStorage.getItem("jwt");
    dispatch(
      updateBookingStatus({
        bookingId: selectedBooking.id,
        status: newStatus,
        jwt,
      })
    );
    handleMenuClose();
  };

  // Download PDF handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Bookings Report", 14, 10);
    autoTable(doc, {
      head: [["Date", "User", "Clinic", "Booking ID", "Status", "Amount"]],
      body: filteredBookings.map((b) => [
        b.createdAt?.split("T")[0] || "N/A",
        b.userDto?.fullName || b.userDto?.name || "N/A",
        b.clinic?.name || b.clinic?.clinicName || "N/A",
        b.id,
        b.bookingStatus,
        `₹${b.totalPrice || 0}`,
      ]),
    });
    doc.save("bookings.pdf");
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{ width: 200 }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Clinic</th>
            <th className="p-2 text-left">Booking ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading && filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {booking.createdAt?.split("T")[0] || "N/A"}
                </td>
                <td className="p-2">
                  {booking.userDto?.fullName || booking.userDto?.name || "N/A"}
                </td>
                <td className="p-2">
                  {booking.clinic?.name || booking.clinic?.clinicName || "N/A"}
                </td>
                <td className="p-2">{booking.id}</td>
                <td
                  className="p-2 font-bold"
                  style={{
                    color:
                      booking.bookingStatus === "CONFIRMED"
                        ? "green"
                        : booking.bookingStatus === "SUCCESS"
                        ? "blue"
                        : booking.bookingStatus === "PENDING"
                        ? "goldenrod"
                        : booking.bookingStatus === "REFUNDED"
                        ? "black"
                        : "red",
                  }}
                >
                  {booking.bookingStatus}
                </td>
                <td className="p-2">₹{booking.totalPrice || 0}</td>
                <td className="p-2">
                  <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                    <MoreVertIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                {loading ? "Loading..." : "No bookings found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx ? "contained" : "outlined"}
            size="small"
            onClick={() => setCurrentPage(idx)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          disabled={
            selectedBooking?.bookingStatus === "PENDING" ||
            !["REFUNDED", "SUCCESS"].includes(selectedBooking?.bookingStatus)
          }
          onClick={handleDeleteBooking}
        >
          Delete Booking
        </MenuItem>
        <MenuItem
          disabled={
            selectedBooking?.bookingStatus === "PENDING" ||
            selectedBooking?.bookingStatus !== "CONFIRMED"
          }
          onClick={() => handleUpdateStatus("CANCELLED")}
        >
          Cancel Booking
        </MenuItem>
        <MenuItem
          disabled={
            selectedBooking?.bookingStatus === "PENDING" ||
            selectedBooking?.bookingStatus !== "CONFIRMED"
          }
          onClick={() => handleUpdateStatus("SUCCESS")}
        >
          Success Booking
        </MenuItem>
        <MenuItem
          disabled={
            selectedBooking?.bookingStatus === "PENDING" ||
            selectedBooking?.bookingStatus !== "CANCELLED"
          }
          onClick={() => handleUpdateStatus("REFUNDED")}
        >
          Refunded Booking
        </MenuItem>
      </Menu>
    </div>
  );
};

export default BookingTable;
