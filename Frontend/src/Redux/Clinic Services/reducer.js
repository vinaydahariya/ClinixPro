import {
  CREATE_SERVICE_REQUEST,
  CREATE_SERVICE_SUCCESS,
  CREATE_SERVICE_FAILURE,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_FAILURE,
  FETCH_SERVICES_BY_CLINIC_REQUEST,
  FETCH_SERVICES_BY_CLINIC_SUCCESS,
  FETCH_SERVICES_BY_CLINIC_FAILURE,
  FETCH_SERVICE_BY_ID_REQUEST,
  FETCH_SERVICE_BY_ID_SUCCESS,
  FETCH_SERVICE_BY_ID_FAILURE,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_SUCCESS,
  DELETE_SERVICE_FAILURE,
  SEARCH_CLINICS_BY_SERVICE_REQUEST,
  SEARCH_CLINICS_BY_SERVICE_SUCCESS,
  SEARCH_CLINICS_BY_SERVICE_FAILURE,
} from "./actionTypes";

const initialState = {
  services: [],
  service: null,
  clinicsByService: [],   // ✅ new state for searched clinics
  loading: false,
  error: null,
  success: false,
};

const serviceOfferingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SERVICE_REQUEST:
    case UPDATE_SERVICE_REQUEST:
    case FETCH_SERVICES_BY_CLINIC_REQUEST:
    case FETCH_SERVICE_BY_ID_REQUEST:
    case DELETE_SERVICE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case CREATE_SERVICE_SUCCESS:
      return { ...state, loading: false, service: action.payload, success: true };

    case UPDATE_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        service: action.payload,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
        success: true,
      };

    case FETCH_SERVICES_BY_CLINIC_SUCCESS:
      return { ...state, loading: false, services: action.payload, success: false };

    case FETCH_SERVICE_BY_ID_SUCCESS:
      return { ...state, loading: false, service: action.payload, success: false };

    case DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        services: state.services.filter((s) => s.id !== action.payload),
        success: true,
      };

    case CREATE_SERVICE_FAILURE:
    case UPDATE_SERVICE_FAILURE:
    case FETCH_SERVICES_BY_CLINIC_FAILURE:
    case FETCH_SERVICE_BY_ID_FAILURE:
    case DELETE_SERVICE_FAILURE:
      return { ...state, loading: false, error: action.payload, success: false };

    case "RESET_SUCCESS_FLAG":
      return { ...state, success: false };


    // ✅ Search clinics by service
    case SEARCH_CLINICS_BY_SERVICE_REQUEST:
      return { ...state, loading: true, error: null };

    case SEARCH_CLINICS_BY_SERVICE_SUCCESS:
      return { ...state, loading: false, clinicsByService: action.payload };

    case SEARCH_CLINICS_BY_SERVICE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }  

};

export default serviceOfferingReducer;
