// reducer.js
import {
    FETCH_EARNINGS_REQUEST,
    FETCH_EARNINGS_SUCCESS,
    FETCH_EARNINGS_FAILURE,
    FETCH_BOOKINGS_REQUEST,
    FETCH_BOOKINGS_SUCCESS,
    FETCH_BOOKINGS_FAILURE,
  } from "./actionTypes";
  
  const initialState = {
    earnings: {
      loading: false,
      data: null,
      error: null,
    },
    bookings: {
      loading: false,
      data: null,
      error: null,
    },
  };
  
  export const chartReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_EARNINGS_REQUEST:
        return {
          ...state,
          earnings: { loading: true, data: null, error: null },
        };
      case FETCH_EARNINGS_SUCCESS:
        return {
          ...state,
          earnings: { loading: false, data: action.payload, error: null },
        };
      case FETCH_EARNINGS_FAILURE:
        return {
          ...state,
          earnings: { loading: false, data: null, error: action.payload },
        };
      case FETCH_BOOKINGS_REQUEST:
        return {
          ...state,
          bookings: { loading: true, data: null, error: null },
        };
      case FETCH_BOOKINGS_SUCCESS:
        return {
          ...state,
          bookings: { loading: false, data: action.payload, error: null },
        };
      case FETCH_BOOKINGS_FAILURE:
        return {
          ...state,
          bookings: { loading: false, data: null, error: action.payload },
        };
      default:
        return state;
    }
  };
  