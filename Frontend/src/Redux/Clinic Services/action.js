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


import api from "../../config/api";

const API_BASE_URL = "/api/service-offering";

// ✅ Create Service
export const createServiceAction = ({ service, jwt }) => async (dispatch) => {
  dispatch({ type: CREATE_SERVICE_REQUEST });

  try {
    const { data } = await api.post(`${API_BASE_URL}/clinic-owner`, service, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: CREATE_SERVICE_SUCCESS, payload: data });
    console.log("✅ Service created:", data);
  } catch (error) {
    console.error("❌ Error creating service:", error);
    dispatch({
      type: CREATE_SERVICE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Update Service
export const updateService = ({ id, service }) => async (dispatch) => {
  dispatch({ type: UPDATE_SERVICE_REQUEST });

  try {
    const { data } = await api.put(
      `${API_BASE_URL}/clinic-owner/${id}`,
      service,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    dispatch({ type: UPDATE_SERVICE_SUCCESS, payload: data });
    console.log("✅ Service updated:", data);
  } catch (error) {
    console.error("❌ Error updating service:", error);
    dispatch({
      type: UPDATE_SERVICE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Services by Clinic ID (optionally by category)
export const fetchServicesByClinicId = ({ clinicId, jwt, categoryId }) => async (dispatch) => {
  dispatch({ type: FETCH_SERVICES_BY_CLINIC_REQUEST });

  try {
    const headers = jwt
      ? { Authorization: `Bearer ${jwt}` }
      : {}; // ✅ Don't send token if not logged in

    const { data } = await api.get(`${API_BASE_URL}/clinic/${clinicId}`, {
      headers,
      params: categoryId ? { categoryId } : {},
    });

    dispatch({ type: FETCH_SERVICES_BY_CLINIC_SUCCESS, payload: data });
    console.log("✅ Fetched services for clinic:", data);
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    dispatch({
      type: FETCH_SERVICES_BY_CLINIC_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// ✅ Fetch Single Service by ID
export const fetchServiceById = (serviceId) => async (dispatch) => {
  dispatch({ type: FETCH_SERVICE_BY_ID_REQUEST });

  try {
    const token = localStorage.getItem("jwt");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await api.get(`${API_BASE_URL}/${serviceId}`, { headers });

    dispatch({ type: FETCH_SERVICE_BY_ID_SUCCESS, payload: data });
    console.log("✅ Fetched service by ID:", data);
  } catch (error) {
    console.error("❌ Error fetching service by ID:", error);
    dispatch({
      type: FETCH_SERVICE_BY_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// ✅ Delete Service
export const deleteService = (serviceId) => async (dispatch) => {
  dispatch({ type: DELETE_SERVICE_REQUEST });

  try {
    const { data } = await api.delete(`/api/service-offering/clinic-owner/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    dispatch({ type: DELETE_SERVICE_SUCCESS, payload: serviceId });
    console.log("✅ Service deleted:", data);
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    dispatch({
      type: DELETE_SERVICE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Search Clinics by Service Name (Public API)
export const searchClinicsByService = (serviceName) => async (dispatch) => {
  dispatch({ type: SEARCH_CLINICS_BY_SERVICE_REQUEST });

  try {
    const { data } = await api.get(`/api/service-offering/search`, {
      params: { name: serviceName },
    });

    dispatch({ type: SEARCH_CLINICS_BY_SERVICE_SUCCESS, payload: data });
    console.log("✅ Clinics fetched by service name:", data);
  } catch (error) {
    console.error("❌ Error fetching clinics by service:", error);
    dispatch({
      type: SEARCH_CLINICS_BY_SERVICE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Reset success flag
export const resetServiceSuccess = () => ({
  type: "RESET_SUCCESS_FLAG",
});

