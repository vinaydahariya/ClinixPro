import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  GET_ALL_CUSTOMERS_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE
} from "./actionTypes";

const initialState = {
  user: null,
  jwt: localStorage.getItem("jwt") || null, // ✅ get token if already stored
  isLoading: false,
  error: null,
  customers: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case DELETE_USER_REQUEST: // ✅ delete request bhi loading karega
      return { ...state, isLoading: true, error: null };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      const token = action.payload?.data?.jwt;
      if (token) {
        localStorage.setItem("jwt", token); // ✅ Save to localStorage
      }
      return {
        ...state,
        isLoading: false,
        jwt: token,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        fetchingUser: false,
      };

    case GET_ALL_CUSTOMERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customers: action.payload, // ✅ poora response store
      };


    // ✅ Delete user success — customers array se remove karo
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload.userId
        ),
      };

    case GET_USER_FAILURE:
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case DELETE_USER_FAILURE: // ✅ delete failure handle
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        fetchingUser: false,
      };

    case LOGOUT:
      localStorage.removeItem("jwt"); // ✅ Remove from localStorage
      return {
        ...state,
        jwt: null,
        user: null,
      };

    default:
      return state;
  }
};

export default authReducer;
