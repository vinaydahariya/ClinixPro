/**
 * Helper to always extract bookings array
 */
const extractBookingsArray = (state) => {
  // ✅ check updated reducer shape first
  if (Array.isArray(state.booking?.allBookings?.content)) {
    return state.booking.allBookings.content;
  }
  if (Array.isArray(state.booking?.bookings)) {
    return state.booking.bookings;
  }
  return [];
};

/**
 * Get total users count from Redux state
 */
export const getTotalUsers = (state) => {
  return state.auth?.customers?.totalItems || 0;
};

/**
 * Get total clinics count from Redux state
 */
export const getTotalClinics = (state) => {
  return state.clinic?.clinics?.length || 0;
};

/**
 * Get total bookings by status
 */
export const getTotalBookingsByStatus = (store, status) => {
  const bookings = extractBookingsArray(store);
  return bookings.filter(b => b.bookingStatus === status).length;
};

export const getTotalEarnings = (store) => {
  const bookings = extractBookingsArray(store);
  return bookings
    .filter(b => b.bookingStatus === "SUCCESS")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
};

export const getTotalRefunds = (store) => {
  const bookings = extractBookingsArray(store);
  return bookings
    .filter(b => b.bookingStatus === "CANCELLED")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
};
