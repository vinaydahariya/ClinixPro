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
  SEARCH_CLINICS_REQUEST,
  SEARCH_CLINICS_SUCCESS,
  SEARCH_CLINICS_FAILURE,
  DELETE_CLINIC_REQUEST,
  DELETE_CLINIC_SUCCESS,
  DELETE_CLINIC_FAILURE,
} from "./actionTypes";

import api from "../../config/api";

const API_BASE_URL = "/api/clinics";

// ✅ Create Clinic (Signup Owner + Create Clinic)


export const createClinic = (reqData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_CLINIC_REQUEST });
  try {
    const { auth } = getState();
    let token = auth?.token;
    
    // Step 1: Signup only if user not logged in (with CUSTOMER role)
    if (!auth?.user) {
      try {
        const signupPayload = {
          ...reqData.ownerDetails,
          role: "CUSTOMER" // First signup as CUSTOMER
        };

        console.log("Signup payload:", signupPayload);
        
        const response = await api.post(`/auth/signup`, signupPayload);
        console.log("Signup response:", response.data);

        if (!response.data.jwt) {
          throw new Error("No JWT token received");
        }
        
        token = response.data.jwt;
        localStorage.setItem("jwt", token);
      } catch (signupError) {
        console.error("Signup failed:", signupError.response?.data);
        throw new Error("Signup failed: " + (signupError.response?.data?.message || signupError.message));
      }
    }

    // Step 2: Create Clinic (backend will auto-update role to CLINIC_OWNER)
    const { data } = await api.post(API_BASE_URL, reqData.clinicDetails, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Clinic created, user role updated:", data);
    dispatch({ type: CREATE_CLINIC_SUCCESS, payload: data });
    reqData.navigate("/clinic-dashboard");
    
  } catch (error) {
    console.error("Clinic creation error:", {
      message: error.message,
      response: error.response?.data
    });
    dispatch({ 
      type: CREATE_CLINIC_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
  }
};


// ✅ Update Clinic
export const updateClinic = (clinicId, clinic) => async (dispatch) => {
  dispatch({ type: UPDATE_CLINIC_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/${clinicId}`, clinic, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch({ type: UPDATE_CLINIC_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_CLINIC_FAILURE, payload: error.message });
  }
};

// ✅ Fetch Clinics (PUBLIC + PRIVATE)
export const fetchClinics = () => async (dispatch) => {
  dispatch({ type: FETCH_CLINICS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await api.get(API_BASE_URL, { headers });
    console.log("all clinics ", data);
    dispatch({ type: FETCH_CLINICS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching clinics", error);
    dispatch({ type: FETCH_CLINICS_FAILURE, payload: error.message });
  }
};

// ✅ Fetch Clinic By ID (PUBLIC + PRIVATE)
export const fetchClinicById = (clinicId) => async (dispatch) => {
  dispatch({ type: FETCH_CLINIC_BY_ID_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await api.get(`${API_BASE_URL}/${clinicId}`, { headers });
    dispatch({ type: FETCH_CLINIC_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_CLINIC_BY_ID_FAILURE, payload: error.message });
  }
};

// ✅ Fetch Clinic by Owner (PRIVATE)
export const fetchClinicByOwner = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_CLINIC_BY_OWNER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/owner`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("clinic by owner - ", data);
    dispatch({ type: FETCH_CLINIC_BY_OWNER_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching clinic by owner - ", error);
    dispatch({ type: FETCH_CLINIC_BY_OWNER_FAILURE, payload: error.message });
  }
};

// ✅ Search Clinics (PUBLIC + PRIVATE)
export const searchClinic = ({ jwt, city }) => async (dispatch) => {
  dispatch({ type: SEARCH_CLINICS_REQUEST });
  try {
    const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

    const { data } = await api.get(`${API_BASE_URL}/search`, {
      headers,
      params: { city: city },
    });
    console.log("Search clinic - ", data);
    dispatch({ type: SEARCH_CLINICS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching clinic by owner - ", error);
    dispatch({ type: SEARCH_CLINICS_FAILURE, payload: error.message });
  }
};


// ✅ Delete Clinic
export const deleteClinic = (clinicId) => async (dispatch) => {
  dispatch({ type: DELETE_CLINIC_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/${clinicId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    dispatch({ type: DELETE_CLINIC_SUCCESS, payload: clinicId });
  } catch (error) {
    dispatch({
      type: DELETE_CLINIC_FAILURE,
      payload: error.response?.data?.message || error.message
    });
  }
};
