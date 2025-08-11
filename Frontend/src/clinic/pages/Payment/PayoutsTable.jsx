import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const PayoutsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { booking } = useSelector(store => store);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // dispatch(fetchPayoutsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  return (
    <div>
          <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align='right'>Status</TableCell>
              {/* <TableCell align="right">Amount</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {booking.bookings.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="left">{item.id}</TableCell>
                <TableCell component="th" scope="row">
                  <div className='flex gap-1 flex-wrap'>
                    {item.services.map((orderItem) =>
                      <div key={orderItem.id} className='flex gap-5'>
                        <img className='w-20 rounded-md' src={orderItem.product.images[0]} alt="" />
                        <div className='flex flex-col justify-between py-2'>
                          <h1>Title: {orderItem.product.title}</h1>
                          <h1>Price: Rs.{orderItem.product.sellingPrice}</h1>
                          <h1>Color: {orderItem.product.color}</h1>
                          <h1>Size: {orderItem.size}</h1>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PayoutsTable