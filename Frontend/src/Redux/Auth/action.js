import axios from "axios";
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
  GET_ALL_CUSTOMERS_REQUEST,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
} from "./actionTypes";
import api, { API_BASE_URL } from "../../config/api";

export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  console.log("auth action - ", userData);
  try {
    const requestData = {
      ...userData.userData,
      username: userData.userData.email, // <-- fix here
    };

    const response = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      requestData
    );

    const user = response.data;

    // ✅ Fix is here
    if (user?.jwt) {
      localStorage.setItem("jwt", user.jwt);
      userData.navigate("/");  // <-- This will now run
    }

    console.log("registerr :- ", user);
    dispatch({ type: REGISTER_SUCCESS, payload: user });
  } catch (error) {
    console.log("error ", error);
    dispatch({ type: REGISTER_FAILURE, payload: error });
  }
};



// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
export const loginUser = ({ data, navigate }) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const response = await axios.post(
      "http://localhost:1016/auth/login",
      {
        email: data.email,
        password: data.password,
      }
    );

    const user = response.data;
    console.log("LOGIN RESPONSE =>", response.data);


if (user?.jwt) {
  localStorage.setItem("jwt", user.jwt);

  const profileResponse = await axios.get(
    "http://localhost:1016/api/users/profile",
    {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    }
  );

  const profile = profileResponse.data;
  console.log("User Profile =>", profile); // ✅ Add this line

  const role = profile.role || profile.user?.role; // 🔥 FIXED HERE

  // ✅ Navigate
  if (role === "ADMIN") {
    navigate("/admin");
  }else {
    navigate("/");
  }

  dispatch({
    type: LOGIN_SUCCESS,
    payload: user,
  });
} else {
  dispatch({
    type: LOGIN_FAILURE,
    payload: "Login failed",
  });
}

  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload:
        error.response?.data?.message || "An error occurred during login",
    });
  }
};


export const getAllCustomers = (token, page = 0, size = 10) => {
  return async (dispatch) => {
    console.log("jwt - ", token);
    dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = response.data;
      dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: users });
      console.log("All Customers", users);
    } catch (error) {
      const errorMessage = error.message;
      console.log(error);
      dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: errorMessage });
    }
  };
};


export const getUser = () => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });

    const token = localStorage.getItem("jwt");
    if (!token) {
      dispatch({ type: GET_USER_FAILURE, payload: "No token found" });
      return;
    }

    try {
      const response = await api.get(`/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ", user);
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};


// Search users by full name (for admin)
export const searchUsersByName = (token, fullName, page = 0, size = 5) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/search?fullName=${encodeURIComponent(fullName)}&page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = response.data;
      dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: users });
      console.log("Search Users Result", users);
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: errorMessage });
    }
  };
};



export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
  };
};

// ✅ Delete User Action (Only Admin)
export const deleteUser = (userId, jwt) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`, // ✅ Bearer prefix added
      }
    };

    const { data } = await axios.delete(
      `${API_BASE_URL}/api/users/${userId}`, // ✅ Full URL
      config
    );

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: { userId, message: data }
    });

  } catch (error) {
    dispatch({
      type: DELETE_USER_FAILURE,
      payload: error.response?.data || "Something went wrong"
    });
  }
};

