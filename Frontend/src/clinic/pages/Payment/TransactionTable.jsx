import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinicBookings } from "../../../Redux/Booking/action";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function TransactionTable() {
  const { booking } = useSelector((store) => store);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchClinicBookings({ jwt: localStorage.getItem("jwt") }));
  }, [dispatch]);

  // ✅ Status Priority
  const statusPriority = {
    CONFIRMED: 1,
    SUCCESS: 2,
    PENDING: 3,
    CANCELLED: 4
  };

  // ✅ Sort bookings (priority → latest date)
  const sortedBookings = React.useMemo(() => {
    return [...(booking.bookings || [])].sort((a, b) => {
      const priorityA = statusPriority[a.bookingStatus] || 99;
      const priorityB = statusPriority[b.bookingStatus] || 99;

      if (priorityA !== priorityB) return priorityA - priorityB;

      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    });
  }, [booking.bookings]);

  // ✅ Download PDF
  const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.text("Transaction Report", 14, 10);

  autoTable(doc, {
    head: [["Date", "Customer", "Booking ID", "Status", "Amount"]],
    body: sortedBookings.map(item => [
      item.startTime?.split("T")[0] || "N/A",
      `${item.customer?.fullName || "N/A"}\n${item.customer?.email || "N/A"}\n${item.customer?.phone || "N/A"}`,
      item.id,
      item.bookingStatus,
      `₹${item.totalPrice}`
    ]),
  });

  doc.save("transactions.pdf");
};


  return (
    <>
      {/* ✅ Download Button */}
      <div className="flex justify-end mb-2">
        <Button variant="outlined" onClick={handleDownloadPDF}>
          Download
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer Details</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBookings.length > 0 ? (
              sortedBookings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="left">
                    <div className="space-y-1">
                      <h1 className="font-medium">
                        {item.startTime?.split("T")[0] || "N/A"}
                      </h1>
                    </div>
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <div className="space-y-2">
                      <h1>{item.customer?.fullName || "N/A"}</h1>
                      <h1 className="font-semibold">
                        {item.customer?.email || "N/A"}
                      </h1>
                      <h1 className="font-bold text-gray-600">
                        {item.customer?.phone || "N/A"}
                      </h1>
                    </div>
                  </TableCell>

                  <TableCell>
                    Booking Id : <strong>{item.id}</strong>
                  </TableCell>

                  {/* ✅ Status Column */}
                  <TableCell>
                    <span
                      style={{
                        color:
                          item.bookingStatus === "CONFIRMED"
                            ? "green"
                            : item.bookingStatus === "SUCCESS"
                            ? "blue"
                            : item.bookingStatus === "PENDING"
                            ? "goldenrod"
                            : "red",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {item.bookingStatus}
                    </span>
                  </TableCell>

                  <TableCell align="right">₹{item.totalPrice}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Transactions Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
