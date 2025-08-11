// ✅ Total earnings from SUCCESS bookings only
export const getPriceTotal = (bookings = []) => {
  return bookings
    ?.filter(b => b?.bookingStatus === "SUCCESS")
    ?.reduce((acc, b) => acc + (b?.totalPrice || 0), 0);
};

// ✅ Last successful payment amount
export const getLastPayment = (bookings = []) => {

  if (!Array.isArray(bookings) || bookings.length === 0) return 0;

  // ✅ 1. Sirf CONFIRMED bookings
  const confirmedBookings = bookings.filter(
    (b) => String(b.bookingStatus).toUpperCase() === "CONFIRMED"
  );

  if (confirmedBookings.length === 0) return 0;

  // ✅ 2. Latest booking nikalna based on createdAt
  const sortedBookings = [...confirmedBookings].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime() || 0;
    const dateB = new Date(b.createdAt).getTime() || 0;
    return dateB - dateA;
  });

  const latestBooking = sortedBookings[0];
  console.log(new Date(latestBooking.createdAt).getTime());

  return Number(latestBooking?.totalPrice) || 0;
};






