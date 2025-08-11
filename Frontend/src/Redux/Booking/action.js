import axios from "axios";
import {
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAILURE,
  FETCH_CUSTOMER_BOOKINGS_REQUEST,
  FETCH_CUSTOMER_BOOKINGS_SUCCESS,
  FETCH_CUSTOMER_BOOKINGS_FAILURE,
  FETCH_CLINIC_BOOKINGS_REQUEST,
  FETCH_CLINIC_BOOKINGS_SUCCESS,
  FETCH_CLINIC_BOOKINGS_FAILURE,
  FETCH_BOOKING_BY_ID_REQUEST,
  FETCH_BOOKING_BY_ID_SUCCESS,
  FETCH_BOOKING_BY_ID_FAILURE,
  UPDATE_BOOKING_STATUS_REQUEST,
  UPDATE_BOOKING_STATUS_SUCCESS,
  UPDATE_BOOKING_STATUS_FAILURE,
  GET_CLINIC_REPORT_REQUEST,
  GET_CLINIC_REPORT_SUCCESS,
  GET_CLINIC_REPORT_FAILURE,
  FETCH_BOOKED_SLOTS_REQUEST,
  FETCH_BOOKED_SLOTS_SUCCESS,
  FETCH_BOOKED_SLOTS_FAILURE,
  UPDATE_BOOKING_SLOT_REQUEST,
  UPDATE_BOOKING_SLOT_SUCCESS,
  UPDATE_BOOKING_SLOT_FAILURE,
  FETCH_ALL_BOOKINGS_REQUEST,
  FETCH_ALL_BOOKINGS_SUCCESS,
  FETCH_ALL_BOOKINGS_FAILURE,
  FETCH_BOOKING_CHART_REQUEST,
  FETCH_BOOKING_CHART_SUCCESS,
  FETCH_BOOKING_CHART_FAILURE,
  SEARCH_BOOKINGS_REQUEST,
  SEARCH_BOOKINGS_SUCCESS,
  SEARCH_BOOKINGS_FAILURE,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

const API_BASE_URL = "/api/bookings";

export const createBooking = ({jwt, clinicId, bookingData}) => async (dispatch) => {
  dispatch({ type: CREATE_BOOKING_REQUEST });
  try {
    const { data } = await api.post(
      API_BASE_URL,
      bookingData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { clinicId, paymentMethod:"RAZORPAY" },
      }
    );
    window.location.href=data.payment_link_url
    console.log(" create booking ", data)
    dispatch({ type: CREATE_BOOKING_SUCCESS, payload: data });
  } catch (error) {
    console.log("error creating booking ",error)
    dispatch({ type: CREATE_BOOKING_FAILURE, payload: error.response?.data?.message });
  }
};

export const fetchCustomerBookings = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_CUSTOMER_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/customer`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("customer bookings ",data)
    dispatch({ type: FETCH_CUSTOMER_BOOKINGS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error ",error)
    dispatch({ type: FETCH_CUSTOMER_BOOKINGS_FAILURE, payload: error.message });
  }
};



export const fetchClinicBookings = ({ jwt }) => async (dispatch) => {
  dispatch({ type: FETCH_CLINIC_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/clinic`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("📥 Raw clinic bookings: ", data);

    const updatedBookings = await Promise.all(
      data.map(async (booking) => {
        let servicesData = [];
        let customerData = booking.customer || null;

        // ✅ Fetch customer details
        if (!customerData && booking.customerId) {
          try {
            const response = await api.get(`/api/users/${booking.customerId}`, {
              headers: { Authorization: `Bearer ${jwt}` },
            });
            customerData = response.data;
          } catch (err) {
            console.error(`❌ Customer fetch error for id ${booking.customerId}`, err);
          }
        }

        // ✅ Fetch services details from correct endpoint
        if (booking.serviceIds?.length) {
          const servicePromises = booking.serviceIds.map(async (id) => {
            try {
              const response = await api.get(`/api/service-offering/${id}`, {
                headers: { Authorization: `Bearer ${jwt}` },
              });
              return response.data;
            } catch (err) {
              console.error(`❌ Service fetch error for id ${id}`, err);
              return null;
            }
          });

          servicesData = (await Promise.all(servicePromises)).filter(Boolean);
        }

        console.log(`📦 Booking ${booking.id} services:`, servicesData);

        return { ...booking, services: servicesData, customer: customerData };
      })
    );

    console.log("✅ Final updated bookings:", updatedBookings);

    dispatch({ type: FETCH_CLINIC_BOOKINGS_SUCCESS, payload: updatedBookings });
  } catch (error) {
    console.log("❌ error fetching clinic bookings ", error);
    dispatch({
      type: FETCH_CLINIC_BOOKINGS_FAILURE,
      payload: error.message,
    });
  }
};





export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKING_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/${bookingId}`);
    dispatch({ type: FETCH_BOOKING_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKING_BY_ID_FAILURE, payload: error.message });
  }
};

export const updateBookingStatus = ({bookingId, status, jwt}) => async (dispatch) => {
  dispatch({ type: UPDATE_BOOKING_STATUS_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/${bookingId}/status`, null, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { status },
    });
    console.log("update booking status ",data)
    dispatch({ type: UPDATE_BOOKING_STATUS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error updating booking status ",error)
    dispatch({ type: UPDATE_BOOKING_STATUS_FAILURE, payload: error.message });
  }
};

export const getClinicReport = (jwt, clinicId) => async (dispatch) => {
  try {
    dispatch({ type: GET_CLINIC_REPORT_REQUEST });

    const response = await api.get(`/api/bookings/clinic/${clinicId}/report`, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    dispatch({
      type: GET_CLINIC_REPORT_SUCCESS,
      payload: response.data, 
    });
    console.log("bookings report ", response.data);
  } catch (error) {
    console.log("error ", error);
    
    dispatch({
      type: GET_CLINIC_REPORT_FAILURE,
      payload: error.response ? error.response.data : error.message, 
    });
  }
};



export const fetchBookedSlotsRequest = () => ({
  type: FETCH_BOOKED_SLOTS_REQUEST,
});

export const fetchBookedSlotsSuccess = (slots) => ({
  type: FETCH_BOOKED_SLOTS_SUCCESS,
  payload: slots,
});

export const fetchBookedSlotsFailure = (error) => ({
  type: FETCH_BOOKED_SLOTS_FAILURE,
  payload: error,
});

// Thunk action to fetch booked slots
export const fetchBookedSlots = ({clinicId, date, jwt}) => async (dispatch) => {
  dispatch(fetchBookedSlotsRequest());

  try {
    const response = await api.get(
      `${API_BASE_URL}/slots/clinic/${clinicId}/date/${date}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("fetch booked slots: ", response.data);
    dispatch(fetchBookedSlotsSuccess(response.data));
  } catch (error) {
    console.log("fetch booked slots error - : ",error);
    dispatch(fetchBookedSlotsFailure(error.message));
  }
};

// Add these new action creators

// Get all bookings (admin only)
// Get all bookings (admin only)
export const fetchAllBookings = ({ jwt, page = 0, size = 10, sortBy = "startTime" }) => async (dispatch) => {
  dispatch({ type: FETCH_ALL_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { page, size, sortBy }
    });

    dispatch({
      type: FETCH_ALL_BOOKINGS_SUCCESS,
      payload: {
        bookings: data.content, // ✅ array
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        currentPage: data.currentPage
      }
    });
  } catch (error) {
    dispatch({ type: FETCH_ALL_BOOKINGS_FAILURE, payload: error.message });
  }
};




// Get booking chart data (admin only)
export const fetchBookingChart = ({jwt, startDate, endDate}) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKING_CHART_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/chart`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { 
        startDate: startDate || null, 
        endDate: endDate || null 
      }
    });
    dispatch({ type: FETCH_BOOKING_CHART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKING_CHART_FAILURE, payload: error.message });
  }
};

// Search bookings by user name (admin only)
export const searchBookings = ({jwt, fullName, page = 0, size = 5}) => async (dispatch) => {
  dispatch({ type: SEARCH_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { fullName, page, size }
    });
    dispatch({ type: SEARCH_BOOKINGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SEARCH_BOOKINGS_FAILURE, payload: error.message });
  }
};

export const updateBookingSlot = ({bookingId, bookingData, jwt}) => async (dispatch) => {
  dispatch({ type: UPDATE_BOOKING_SLOT_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/${bookingId}/update-slot`,
      bookingData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    console.log("update booking slot ", data);
    dispatch({ type: UPDATE_BOOKING_SLOT_SUCCESS, payload: data });
  } catch (error) {
    console.log("error updating booking slot ", error);
    dispatch({ type: UPDATE_BOOKING_SLOT_FAILURE, payload: error.message });
  }
};



// Delete booking action
export const deleteBooking = (bookingId, jwt) => async (dispatch) => {
  dispatch({ type: DELETE_BOOKING_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/${bookingId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: DELETE_BOOKING_SUCCESS,
      payload: bookingId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BOOKING_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

