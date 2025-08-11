import {
  CREATE_CLINIC_REQUEST,
  CREATE_CLINIC_SUCCESS,
  CREATE_CLINIC_FAILURE,
  UPDATE_CLINIC_REQUEST,
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_FAILURE,
  FETCH_CLINICS_REQUEST,
  FETCH_CLINICS_SUCCESS,
  FETCH_CLINICS_FAILURE,
  FETCH_CLINIC_BY_ID_REQUEST,
  FETCH_CLINIC_BY_ID_SUCCESS,
  FETCH_CLINIC_BY_ID_FAILURE,
  FETCH_CLINIC_BY_OWNER_REQUEST,
  FETCH_CLINIC_BY_OWNER_SUCCESS,
  FETCH_CLINIC_BY_OWNER_FAILURE,
  SEARCH_CLINICS_SUCCESS,
  SEARCH_CLINICS_REQUEST,
  SEARCH_CLINICS_FAILURE,
  DELETE_CLINIC_REQUEST,
  DELETE_CLINIC_SUCCESS,
  DELETE_CLINIC_FAILURE
} from "./actionTypes";

const initialState = {
  clinics: [],
  clinic: null,
  searchClinics: [],
  loading: false,
  error: null,
};

const clinicReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CLINIC_REQUEST:
    case UPDATE_CLINIC_REQUEST:
    case FETCH_CLINICS_REQUEST:
    case FETCH_CLINIC_BY_ID_REQUEST:
    case FETCH_CLINIC_BY_OWNER_REQUEST:
    case SEARCH_CLINICS_REQUEST:
    case DELETE_CLINIC_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_CLINIC_SUCCESS:
      return { ...state, loading: false, clinic: action.payload };

    case UPDATE_CLINIC_SUCCESS:
      return { ...state, loading: false, clinic: action.payload };

    case SEARCH_CLINICS_SUCCESS:
      return { ...state, loading: false, clinics: action.payload, searchClinics: action.payload };


    case FETCH_CLINICS_SUCCESS:
      return { ...state, loading: false, clinics: action.payload };

    case FETCH_CLINIC_BY_ID_SUCCESS:
    case FETCH_CLINIC_BY_OWNER_SUCCESS:
      return { ...state, loading: false, clinic: action.payload };

    case DELETE_CLINIC_SUCCESS:
      return {
        ...state,
        loading: false,
        clinics: state.clinics.filter(clinic => clinic.id !== action.payload),
        clinic: state.clinic?.id === action.payload ? null : state.clinic
      };

    case CREATE_CLINIC_FAILURE:
    case UPDATE_CLINIC_FAILURE:
    case FETCH_CLINICS_FAILURE:
    case FETCH_CLINIC_BY_ID_FAILURE:
    case FETCH_CLINIC_BY_OWNER_FAILURE:
    case SEARCH_CLINICS_FAILURE:
    case DELETE_CLINIC_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default clinicReducer;
