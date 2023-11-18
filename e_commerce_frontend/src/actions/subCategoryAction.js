import {
  CLEAR_ERRORS,
  DELETE_SUB_CATEGORY_FAIL,
  DELETE_SUB_CATEGORY_REQUEST,
  DELETE_SUB_CATEGORY_SUCCESS,
  GET_SUB_CATEGORIES_FAIL,
  GET_SUB_CATEGORIES_REQUEST,
  GET_SUB_CATEGORIES_SUCCESS,
  NEW_SUB_CATEGORY_FAIL,
  NEW_SUB_CATEGORY_REQUEST,
  NEW_SUB_CATEGORY_SUCCESS,
  SUB_CATEGORIES_FOR_CATEGORY_FAIL,
  SUB_CATEGORIES_FOR_CATEGORY_REQUEST,
  SUB_CATEGORIES_FOR_CATEGORY_SUCCESS,
  SUB_CATEGORY_DETAILS_FAIL,
  SUB_CATEGORY_DETAILS_REQUEST,
  SUB_CATEGORY_DETAILS_SUCCESS,
  UPDATE_SUB_CATEGORY_FAIL,
  UPDATE_SUB_CATEGORY_REQUEST,
  UPDATE_SUB_CATEGORY_SUCCESS,
} from "../constants/subCategoryConstants";
import axiosInstance from "../utils/Config";

// Get All Sub Categories
export const getAllSubCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_SUB_CATEGORIES_REQUEST,
    });
    const { data } = await axiosInstance.get("/api/v1/admin/subcategories")

    dispatch({
      type: GET_SUB_CATEGORIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_SUB_CATEGORIES_FAIL,
      payload: error.response,
    });
  }
};

// Get Sub Category Details
export const getSubCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: SUB_CATEGORY_DETAILS_REQUEST,
    });
    const { data } = await axiosInstance.get(`/api/v1/admin/subcategory/${id}`)
    dispatch({
      type: SUB_CATEGORY_DETAILS_SUCCESS,
      payload: data.subcategory,
    });
  } catch (error) {
    dispatch({
      type: SUB_CATEGORY_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create New Sub Category
export const createSubCategory = (subCategoryData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SUB_CATEGORY_REQUEST });
    const config = { "Content-Type": "application/json" };
    const { data } = await axiosInstance.post("/api/v1/admin/subcategory/new", subCategoryData, config)

    dispatch({
      type: NEW_SUB_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_SUB_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Sub Category
export const updateSubCategory =
  (subCategoryId, subCategoryData) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_SUB_CATEGORY_REQUEST });
      const config = { "Content-Type": "application/json" };
      const { data } = await axiosInstance.put(`/api/v1/admin/subcategory/${subCategoryId}`, subCategoryData, config)

      dispatch({
        type: UPDATE_SUB_CATEGORY_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_SUB_CATEGORY_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Delete Sub Category
export const deleteSubCategory = (subCategoryId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SUB_CATEGORY_REQUEST });
    const { data } = await axiosInstance.delete(`/api/v1/admin/subcategory/${subCategoryId}`)

    dispatch({
      type: DELETE_SUB_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SUB_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get Sub Category by category
export const getSubCategoryByCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: SUB_CATEGORIES_FOR_CATEGORY_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/subcategories/${categoryId}`)

    dispatch({
      type: SUB_CATEGORIES_FOR_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUB_CATEGORIES_FOR_CATEGORY_FAIL,
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
