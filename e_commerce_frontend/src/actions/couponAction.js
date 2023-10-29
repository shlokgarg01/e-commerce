import axios from "axios";
import {
  CLEAR_ERRORS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  DELETE_COUPON_FAIL,
  DELETE_COUPON_REQUEST,
  DELETE_COUPON_SUCCESS,
  GET_COUPONS_FAIL,
  GET_COUPONS_REQUEST,
  GET_COUPONS_SUCCESS,
  NEW_COUPON_FAIL,
  NEW_COUPON_REQUEST,
  NEW_COUPON_SUCCESS,
  UPDATE_COUPON_FAIL,
  UPDATE_COUPON_REQUEST,
  UPDATE_COUPON_SUCCESS,
} from "../constants/couponConstants";

// Get All Coupons
export const getAllCoupons = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_COUPONS_REQUEST,
    });
    const { data } = await axios.get("/api/v1/admin/coupons")

    dispatch({
      type: GET_COUPONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_COUPONS_FAIL,
      payload: error.response,
    });
  }
};

// Get Coupon Details
export const getCouponDetails = (couponId) => async (dispatch) => {
  try {
    dispatch({
      type: COUPON_DETAILS_REQUEST,
    });
    const { data } = await axios.get(`/api/v1/admin/coupon/${couponId}`)

    dispatch({
      type: COUPON_DETAILS_SUCCESS,
      payload: data.coupon,
    });
  } catch (error) {
    dispatch({
      type: COUPON_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create New Coupon
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_COUPON_REQUEST });
    const config = { "Content-Type": "application/json" };
    const { data } = await axios.post("/api/v1/admin/coupon/new", couponData, config)

    dispatch({
      type: NEW_COUPON_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_COUPON_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Coupon
export const updateCoupon = (couponId, couponData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_COUPON_REQUEST });
    const config = { "Content-Type": "application/json" };
    const { data } = await axios.put(`/api/v1/admin/coupon/${couponId}`, couponData, config)

    dispatch({
      type: UPDATE_COUPON_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_COUPON_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Coupon
export const deleteCoupon = (couponId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COUPON_REQUEST });
    const { data } = await axios.delete(`/api/v1/admin/coupon/${couponId}`)

    dispatch({
      type: DELETE_COUPON_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COUPON_FAIL,
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
