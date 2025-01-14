import {
  CLEAR_ERRORS,
  GET_BANNERS_FAIL,
  GET_BANNERS_REQUEST,
  GET_BANNERS_SUCCESS,
  GET_STATS_FAIL,
  GET_STATS_REQUEST,
  GET_STATS_SUCCESS,
  UPDATE_BANNERS_FAIL,
  UPDATE_BANNERS_REQUEST,
  UPDATE_BANNERS_SUCCESS,
} from "../constants/constantsConstants";
import axiosInstance from "../utils/Config";

// Get All Banners
export const getAllBanners = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_BANNERS_REQUEST,
    });
    const { data } = await axiosInstance.get("/api/v1/constants/banners");

    dispatch({
      type: GET_BANNERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_BANNERS_FAIL,
      payload: error.response,
    });
  }
};

// Update Banners
export const updateBanners = (bannerData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BANNERS_REQUEST });
    const config = { "Content-Type": "application/json" };
    const { data } = await axiosInstance.post(
      "/api/v1/constants/update/banners",
      bannerData,
      config
    );

    dispatch({
      type: UPDATE_BANNERS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BANNERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Stats for Home Page
export const getAllStats = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_STATS_REQUEST,
    });
    const { data } = await axiosInstance.get("/api/v1/constants/stats");

    dispatch({
      type: GET_STATS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_STATS_FAIL,
      payload: error.response,
    });
  }
};

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
