import axios from "axios";
import {
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  CLEAR_ERRORS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGOUT_FAIL,
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  LOGOUT_SUCCESS,
  LOGIN_VIA_OTP_REQUEST,
  LOGIN_VIA_OTP_SUCCESS,
  LOGIN_VIA_OTP_FAIL,
  SEND_LOGIN_OTP_REQUEST,
  SEND_LOGIN_OTP_SUCCESS,
  SEND_LOGIN_OTP_FAIL,
} from "../constants/userConstants";
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = `application/json`;

// Login via email & password
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const {data} = await axios.post(`/api/v1/login`, { email, password }, config)

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// send OTP FOR LOGIN
export const sendOPTPLogin = (contactNumber) => async (dispatch) => {
  try {
    dispatch({ type: SEND_LOGIN_OTP_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const {data} = await axios.post(`/api/v1/login/otp/send`, { contactNumber }, config)

    dispatch({ type: SEND_LOGIN_OTP_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: SEND_LOGIN_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Verify OTP & Login
export const loginViaOTP = (contactNumber, otp) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_VIA_OTP_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const {data} = await axios.post(`/api/v1/login/otp/verify`, { contactNumber, otp }, config)

    dispatch({ type: LOGIN_VIA_OTP_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOGIN_VIA_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// load existing user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    console.log("--------------------------------")
    const {data} = await axios.get(`/api/v1/me`)
    console.log("=============================", data)

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// logout user
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`)
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await axios.get(`/api/v1/admin/users`)
    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get User Details -- Admin
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {data} = await axios.get(`/api/v1/admin/user/${id}`)
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update User Details -- Admin
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const config = { "Content-Type": "application/json" };
    const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete User -- Admin
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

    dispatch({ type: DELETE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
