import {
  CLEAR_ERRORS,
  GET_BANNERS_FAIL,
  GET_BANNERS_REQUEST,
  GET_BANNERS_SUCCESS,
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

// Used to clear all the errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
