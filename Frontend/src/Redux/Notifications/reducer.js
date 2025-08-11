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

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

// Reducer function
const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch requests
    case FETCH_NOTIFICATIONS_REQUEST:
    case FETCH_NOTIFICATIONS_BY_USER_REQUEST:
    case FETCH_NOTIFICATIONS_BY_CLINIC_REQUEST:
    case CREATE_NOTIFICATION_REQUEST:
    case MARK_NOTIFICATION_AS_READ_REQUEST:
    case DELETE_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };

    case FETCH_NOTIFICATIONS_BY_USER_SUCCESS:
    case FETCH_NOTIFICATIONS_BY_CLINIC_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
      };

    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (!action.payload.isRead ? 1 : 0),
      };

    case CREATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: [...state.notifications, action.payload],
        unreadCount: state.unreadCount + (!action.payload.isRead ? 1 : 0),
      };

    case MARK_NOTIFICATION_AS_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount:
          state.unreadCount > 0
            ? state.unreadCount -
              (state.notifications.find((n) => n.id === action.payload.id)?.isRead
                ? 0
                : 1)
            : 0,
      };

    case "CLEAR_ALL_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: [],
        unreadCount: 0,
      };

    case "CLEAR_ALL_NOTIFICATIONS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
  

    case DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
        unreadCount: state.notifications.filter(
          (notification) => notification.id !== action.payload && !notification.isRead
        ).length,
      };

    // Failures
    case FETCH_NOTIFICATIONS_FAILURE:
    case FETCH_NOTIFICATIONS_BY_USER_FAILURE:
    case FETCH_NOTIFICATIONS_BY_CLINIC_FAILURE:
    case CREATE_NOTIFICATION_FAILURE:
    case MARK_NOTIFICATION_AS_READ_FAILURE:
    case DELETE_NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;
