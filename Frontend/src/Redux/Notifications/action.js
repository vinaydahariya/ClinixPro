import axios from "axios";
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_NOTIFICATIONS_BY_USER_REQUEST,
  FETCH_NOTIFICATIONS_BY_USER_SUCCESS,
  FETCH_NOTIFICATIONS_BY_USER_FAILURE,
  FETCH_NOTIFICATIONS_BY_CLINIC_REQUEST,
  FETCH_NOTIFICATIONS_BY_CLINIC_SUCCESS,
  FETCH_NOTIFICATIONS_BY_CLINIC_FAILURE,
  CREATE_NOTIFICATION_REQUEST,
  CREATE_NOTIFICATION_SUCCESS,
  CREATE_NOTIFICATION_FAILURE,
  MARK_NOTIFICATION_AS_READ_REQUEST,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
  MARK_NOTIFICATION_AS_READ_FAILURE,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_FAILURE,
  ADD_NOTIFICATION,
} from "./actionTypes";
import api from "../../config/api";

// Helper function for handling requests
const API_URL = "/api/notifications";

// Fetch all notifications
export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
  try {
    const response = await api.get(`${API_URL}`);
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, payload: error.message });
  }
};

// Fetch notifications by user ID
export const fetchNotificationsByUser = ({userId,jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_REQUEST });
  try {
    const response = await api.get(`${API_URL}/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        
      }
    );
    console.log("fetch notifications", response.data)
    dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_SUCCESS, payload: response.data });
  } catch (error) {
    console.log("error fetching notifications",error)
    dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_FAILURE, payload: error.message });
  }
};

// Fetch notifications by clinic ID
export const fetchNotificationsByClinic = ({clinicId,jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_BY_CLINIC_REQUEST });
  try {
    const response = await api.get(`${API_URL}/clinic-owner/clinic/${clinicId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        
      }
    );
    console.log("fetch clinic notifications", response.data)
    dispatch({ type: FETCH_NOTIFICATIONS_BY_CLINIC_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_NOTIFICATIONS_BY_CLINIC_FAILURE, payload: error.message });
  }
};



// Mark notification as read
export const markNotificationAsRead = ({notificationId,jwt}) => async (dispatch) => {
  dispatch({ type: MARK_NOTIFICATION_AS_READ_REQUEST });
  try {
    const response = await api.put(`${API_URL}/${notificationId}/read`,{},{
      headers: { Authorization: `Bearer ${jwt}` },
      
    });
    console.log("mark notification as read", response.data)
    dispatch({ type: MARK_NOTIFICATION_AS_READ_SUCCESS, payload: response.data });
  } catch (error) {
    console.log("mark notification as read error - ", error)
    dispatch({ type: MARK_NOTIFICATION_AS_READ_FAILURE, payload: error.message });
  }
};

// Delete a notification
export const deleteNotification = (notificationId) => async (dispatch) => {
  dispatch({ type: DELETE_NOTIFICATION_REQUEST });
  try {
    await api.delete(`${API_URL}/${notificationId}`);
    dispatch({ type: DELETE_NOTIFICATION_SUCCESS, payload: notificationId });
  } catch (error) {
    dispatch({ type: DELETE_NOTIFICATION_FAILURE, payload: error.message });
  }
};

// Clear all notifications for a specific user
export const clearAllNotificationsByUser = ({ userId, jwt }) => async (dispatch) => {
  dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_REQUEST" });
  try {
    await api.delete(`${API_URL}/user/${userId}/clear`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_SUCCESS", payload: { target: "user" } });
  } catch (error) {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_FAILURE", payload: error.message });
  }
};

// Clear all notifications for a specific clinic
export const clearAllNotificationsByClinic = ({ clinicId, jwt }) => async (dispatch) => {
  dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_REQUEST" });
  try {
    await api.delete(`${API_URL}/clinic/${clinicId}/clear`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_SUCCESS", payload: { target: "clinic" } });
  } catch (error) {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_FAILURE", payload: error.message });
  }
};


export const addNotification = (notification) => {
    return {
      type: ADD_NOTIFICATION,
      payload: notification,
    };
  };
