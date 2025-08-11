import axios from "axios";
import {
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

// Fetch Reviews
// Fetch Reviews
// Fetch Reviews (Optimized)
export const fetchReviews =
  ({ clinicId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_REVIEWS_REQUEST });

    try {
      const config = {};

      // ✅ Token tabhi bhejo jab valid ho
      if (jwt && jwt.trim() !== "") {
        config.headers = { Authorization: `Bearer ${jwt}` };
      }

      const response = await api.get(`/api/reviews/clinic/${clinicId}`, config);

      console.log("✅ Reviews fetched:", response.data);

      dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: response.data });
    } catch (error) {
      console.error("❌ Error fetching reviews:", error.response?.data || error.message);

      dispatch({
        type: FETCH_REVIEWS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch reviews",
      });
    }
  };


// Create Review
export const createReview =
  ({ clinicId, reviewData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_REVIEW_REQUEST });

    try {
      const response = await api.post(
        `/api/reviews/clinic/${clinicId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("created review: ", response.data)
      dispatch({ type: CREATE_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
        console.log("error creating review: ", error)
      dispatch({ type: CREATE_REVIEW_FAILURE, payload: error.message });
    }
  };

// Update Review
export const updateReview =
  ({reviewId, reviewData, jwt}) => async (dispatch) => {
    dispatch({ type: UPDATE_REVIEW_REQUEST });

    try {
      const response = await api.put(`/api/reviews/${reviewId}`, 
        reviewData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: UPDATE_REVIEW_FAILURE, payload: error.message });
    }
  };

// Delete Review
export const deleteReview = ({reviewId, jwt}) => async (dispatch) => {
  dispatch({ type: DELETE_REVIEW_REQUEST });

  try {
    await api.delete(`/api/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("deleted review: ", reviewId)
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
  } catch (error) {
    console.log("error deleting review: ", error)
    dispatch({ type: DELETE_REVIEW_FAILURE, payload: error.message });
  }
};

// Redux/Review/action.js
export const fetchMultipleClinicRatings = (clinicIds, jwt) => async (dispatch) => {
  try {
    const ratingsData = {};
    await Promise.all(
      clinicIds.map(async (id) => {
        const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
        const res = await api.get(`/api/reviews/clinic/${id}`, config);
        const reviews = res.data || [];
        ratingsData[id] = reviews.length
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
          : 0;
      })
    );
    dispatch({ type: "FETCH_MULTIPLE_RATINGS_SUCCESS", payload: ratingsData });
  } catch (error) {
    console.error("❌ Error fetching multiple clinic ratings:", error);
  }
};
