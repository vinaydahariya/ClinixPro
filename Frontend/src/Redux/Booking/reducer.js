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
  GET_CLINIC_REPORT_SUCCESS,
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

const initialState = {
  bookings: [],
  slots: [],
  booking: null,
  loading: false,
  error: null,
  report: null,
  allBookings: {
    content: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
  bookingChart: [],
  searchResults: [],
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BOOKING_REQUEST:
    case FETCH_CUSTOMER_BOOKINGS_REQUEST:
    case FETCH_CLINIC_BOOKINGS_REQUEST:
    case FETCH_BOOKING_BY_ID_REQUEST:
    case UPDATE_BOOKING_STATUS_REQUEST:
    case DELETE_BOOKING_REQUEST: // delete request added
      return { ...state, loading: true, error: null };

    case CREATE_BOOKING_SUCCESS:
      return { ...state, loading: false, booking: action.payload };

    case FETCH_CUSTOMER_BOOKINGS_SUCCESS:
    case FETCH_CLINIC_BOOKINGS_SUCCESS:
      return { ...state, loading: false, bookings: action.payload };

    case FETCH_BOOKING_BY_ID_SUCCESS:
      return { ...state, loading: false, booking: action.payload };

    case UPDATE_BOOKING_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.payload
        ),
      };

    case GET_CLINIC_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        report: action.payload,
      };

    case FETCH_BOOKED_SLOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        slots: action.payload,
        error: null,
      };

    case CREATE_BOOKING_FAILURE:
    case FETCH_CUSTOMER_BOOKINGS_FAILURE:
    case FETCH_CLINIC_BOOKINGS_FAILURE:
    case FETCH_BOOKING_BY_ID_FAILURE:
    case UPDATE_BOOKING_STATUS_FAILURE:
    case DELETE_BOOKING_FAILURE: // delete failure added
      return { ...state, loading: false, error: action.payload };

    case UPDATE_BOOKING_SLOT_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_BOOKING_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        booking: action.payload,
      };

    case UPDATE_BOOKING_SLOT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ALL_BOOKINGS_REQUEST:
    case FETCH_BOOKING_CHART_REQUEST:
    case SEARCH_BOOKINGS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ALL_BOOKINGS_SUCCESS:
  return {
    ...state,
    loading: false,
    bookings: action.payload.bookings, // direct array
    allBookings: {                     // ✅ properly populate allBookings
      content: action.payload.bookings,
      totalPages: action.payload.totalPages,
      totalItems: action.payload.totalItems,
      currentPage: action.payload.currentPage
    }
  };



    case FETCH_BOOKING_CHART_SUCCESS:
      return {
        ...state,
        loading: false,
        bookingChart: action.payload,
      };

    case SEARCH_BOOKINGS_SUCCESS:
  return {
    ...state,
    loading: false,
    bookings: action.payload, // replace bookings with search result
  };

    case FETCH_ALL_BOOKINGS_FAILURE:
    case FETCH_BOOKING_CHART_FAILURE:
    case SEARCH_BOOKINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default bookingReducer;
