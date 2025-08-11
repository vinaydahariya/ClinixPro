// actions/categoryActions.js
import axios from "axios";
import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_ALL_CATEGORIES_REQUEST,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_CATEGORIES_FAILURE,
  GET_CATEGORIES_BY_CLINIC_REQUEST,
  GET_CATEGORIES_BY_CLINIC_SUCCESS,
  GET_CATEGORIES_BY_CLINIC_FAILURE,
  GET_CATEGORY_BY_ID_REQUEST,
  GET_CATEGORY_BY_ID_SUCCESS,
  GET_CATEGORY_BY_ID_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

const BASE_URL = "/api/categories";

// Create Category
export const createCategory =
  ({ category, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const config = { headers: { Authorization: `Bearer ${jwt}` } };
      const response = await api.post(`${BASE_URL}/clinic-owner`, category, config);
      console.log("created category", response.data);
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
    } catch (error) {
      console.log("error creating category", error);
      dispatch({
        type: CREATE_CATEGORY_FAILURE,
        payload: error.response?.data || "Error creating category",
      });
    }
  };

// Get All Categories
export const getAllCategories = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CATEGORIES_REQUEST });
  try {
    const response = await api.get(BASE_URL);
    dispatch({ type: GET_ALL_CATEGORIES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_ALL_CATEGORIES_FAILURE,
      payload: error.response?.data || "Error fetching categories",
    });
  }
};

// Get Categories by Clinic
export const getCategoriesByClinic = ({jwt, clinicId}) => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_BY_CLINIC_REQUEST });
  try {
    const config = jwt
      ? { headers: { Authorization: `Bearer ${jwt}` } }
      : {}; // ✅ No header if no token

    const response = await api.get(`${BASE_URL}/clinic/${clinicId}`, config);
    dispatch({ type: GET_CATEGORIES_BY_CLINIC_SUCCESS, payload: response.data });
  } catch (error) {
    console.log("error getting clinic categories", error);
    dispatch({
      type: GET_CATEGORIES_BY_CLINIC_FAILURE,
      payload: error.response?.data || "Error fetching clinic categories",
    });
  }
};

// Get Category by ID
export const getCategoryById = (id) => async (dispatch) => {
  dispatch({ type: GET_CATEGORY_BY_ID_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get(`${BASE_URL}/${id}`, config);
    dispatch({ type: GET_CATEGORY_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_BY_ID_FAILURE,
      payload: error.response?.data || "Error fetching category",
    });
  }
};


export const updateCategory = ({id, category}) => async (dispatch) => {
  dispatch({ type: UPDATE_CATEGORY_REQUEST });

  try {
    const token = localStorage.getItem("jwt"); 
    const response = await api.put(
      `/api/categories/clinic-owner/${id}`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: response.data, 
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAILURE,
      payload: error.response?.data || "Failed to update category"
    });
  }
};

// Delete Category
export const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    await api.delete(`${BASE_URL}/clinic-owner/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAILURE,
      payload: error.response?.data || "Error deleting category",
    });
  }
};
