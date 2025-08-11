import {
    PROCEED_PAYMENT_REQUEST,
    PROCEED_PAYMENT_SUCCESS,
    PROCEED_PAYMENT_FAILURE,
  } from "./actionTypes";
  

  
  const initialState = {
    loading: false,
    success: null,
    error: null,
  };
  
  const proceedPaymentReducer = (state = initialState, action) => {
    switch (action.type) {
      case PROCEED_PAYMENT_REQUEST:
        return {
          ...state,
          loading: true,
          success: null,
          error: null,
        };
      case PROCEED_PAYMENT_SUCCESS:
        return {
          ...state,
          loading: false,
          success: action.payload, // `true` or `false`
          error: null,
        };
      case PROCEED_PAYMENT_FAILURE:
        return {
          ...state,
          loading: false,
          success: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default proceedPaymentReducer;
  