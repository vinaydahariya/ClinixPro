import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  IconButton,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinicBookings, updateBookingStatus } from "../../../Redux/Booking/action";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function BookingTable() {
  const { booking } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [hiddenBookings, setHiddenBookings] = React.useState([]);

  const open = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const hiddenKey = `hiddenBookings_${jwt}`;

  // ✅ Load hidden bookings on mount
  React.useEffect(() => {
    const savedHidden = JSON.parse(localStorage.getItem(hiddenKey) || "[]");
    setHiddenBookings(savedHidden);
  }, [hiddenKey]);

  // ✅ Fetch bookings
  React.useEffect(() => {
    if (jwt) {
      dispatch(fetchClinicBookings({ jwt }));
    }
  }, [dispatch, jwt]);

  // ✅ Update hidden list in localStorage
  React.useEffect(() => {
    localStorage.setItem(hiddenKey, JSON.stringify(hiddenBookings));
  }, [hiddenBookings, hiddenKey]);

  // ✅ Priority order
  const statusPriority = {
    CONFIRMED: 1,
    PENDING: 2,
    SUCCESS: 3,
    CANCELLED: 4,
  };

  // ✅ Filter + Sort bookings
  const filteredBookings = React.useMemo(() => {
    return (
      booking?.bookings
        ?.filter((item) => !hiddenBookings.includes(item.id))
        .sort((a, b) => {
          // 1️⃣ Status priority
          const priorityA = statusPriority[a.bookingStatus] || 99;
          const priorityB = statusPriority[b.bookingStatus] || 99;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // 2️⃣ Latest createdAt (descending)
          const dateA = new Date(a.createdAt).getTime() || 0;
          const dateB = new Date(b.createdAt).getTime() || 0;
          return dateB - dateA;
        }) || []
    );
  }, [booking?.bookings, hiddenBookings]);

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  // ✅ Remove booking from UI only
  const handleRemoveFromList = () => {
    if (selectedBooking && !hiddenBookings.includes(selectedBooking.id)) {
      const updated = [...hiddenBookings, selectedBooking.id];
      setHiddenBookings(updated);
      localStorage.setItem(hiddenKey, JSON.stringify(updated)); // ✅ instant save
    }
    handleMenuClose();
  };

  // ✅ Mark booking as SUCCESS
  const handleBookingSuccess = () => {
    dispatch(
      updateBookingStatus({
        bookingId: selectedBooking.id,
        status: "SUCCESS",
        jwt,
      })
    );
    handleMenuClose();
  };

  // ✅ Cancel booking
  const handleCancelBooking = () => {
    dispatch(
      updateBookingStatus({
        bookingId: selectedBooking.id,
        status: "CANCELLED",
        jwt,
      })
    );
    handleMenuClose();
  };

  // ✅ Restore all removed bookings
  const handleRestoreBookings = () => {
    setHiddenBookings([]);
    localStorage.removeItem(hiddenKey);
  };

  return (
    <>
      <div className="flex items-center justify-between pb-5">
        <h1 className="font-bold text-xl">Bookings</h1>
        {hiddenBookings.length > 0 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRestoreBookings}
          >
            Restore Removed Bookings
          </Button>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Services</StyledTableCell>
              <StyledTableCell>Time & Date</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>
                  <ul className="space-y-2">
                    {item.services && item.services.length > 0 ? (
                      item.services.map((service, index) => (
                        <li key={index}>{service.name}</li>
                      ))
                    ) : (
                      <li>No Services Found</li>
                    )}
                  </ul>
                </StyledTableCell>

                <StyledTableCell className="space-y-2">
                  <p>Date : {item.startTime?.split("T")[0]}</p>
                  <p>Time : {item.startTime?.split("T")[1]}</p>
                </StyledTableCell>

                <StyledTableCell>₹{item.totalPrice}</StyledTableCell>

                <StyledTableCell className="space-y-2">
                  <p>Full Name : {item.customer?.fullName || "N/A"}</p>
                  <p>Email : {item.customer?.email || "N/A"}</p>
                </StyledTableCell>

                <StyledTableCell>
                  <p
                    style={{
                      color:
                        item.bookingStatus === "CONFIRMED"
                          ? "green"
                          : item.bookingStatus === "PENDING"
                          ? "goldenrod"
                          : item.bookingStatus === "SUCCESS"
                          ? "blue"
                          : "red",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                  >
                    {item.bookingStatus}
                  </p>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ 3-Dot Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          sx: {
            "& .MuiMenuItem-root": {
              fontSize: "14px",
              fontWeight: "normal !important",
              color: "black !important",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleRemoveFromList}
          disabled={selectedBooking?.bookingStatus !== "SUCCESS"}
          sx={{ color: "red !important", fontWeight: "normal !important" }}
        >
          Remove from List
        </MenuItem>

        <MenuItem
          onClick={handleBookingSuccess}
          disabled={selectedBooking?.bookingStatus !== "CONFIRMED"}
          sx={{ color: "green !important", fontWeight: "normal !important" }}
        >
          Booking Success
        </MenuItem>

        <MenuItem
          onClick={handleCancelBooking}
          disabled={selectedBooking?.bookingStatus !== "CONFIRMED"}
          sx={{ color: "orange !important", fontWeight: "normal !important" }}
        >
          Cancel Booking
        </MenuItem>
      </Menu>
    </>
  );
}
