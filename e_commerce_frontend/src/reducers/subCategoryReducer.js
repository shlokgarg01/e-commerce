import {
  CLEAR_ERRORS,
  DELETE_SUB_CATEGORY_FAIL,
  DELETE_SUB_CATEGORY_REQUEST,
  DELETE_SUB_CATEGORY_RESET,
  DELETE_SUB_CATEGORY_SUCCESS,
  GET_SUB_CATEGORIES_FAIL,
  GET_SUB_CATEGORIES_REQUEST,
  GET_SUB_CATEGORIES_SUCCESS,
  NEW_SUB_CATEGORY_FAIL,
  NEW_SUB_CATEGORY_REQUEST,
  NEW_SUB_CATEGORY_RESET,
  NEW_SUB_CATEGORY_SUCCESS,
  SUB_CATEGORY_DETAILS_FAIL,
  SUB_CATEGORY_DETAILS_REQUEST,
  SUB_CATEGORY_DETAILS_SUCCESS,
  UPDATE_SUB_CATEGORY_FAIL,
  UPDATE_SUB_CATEGORY_REQUEST,
  UPDATE_SUB_CATEGORY_RESET,
  UPDATE_SUB_CATEGORY_SUCCESS,
} from "../constants/subCategoryConstants";

export const subCategoriesReducer = (state = { subCategories: [] }, action) => {
  switch (action.type) {
    case GET_SUB_CATEGORIES_REQUEST:
      return {
        loading: true,
        subCategories: [],
      };
    case GET_SUB_CATEGORIES_SUCCESS:
      return {
        loading: false,
        subCategories: action.payload.subcategories,
      };
    case GET_SUB_CATEGORIES_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const subCategoryDetailsReducer = (
  state = { subCategory: {} },
  action
) => {
  switch (action.type) {
    case SUB_CATEGORY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case SUB_CATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        subCategory: action.payload,
      };
    case SUB_CATEGORY_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newSubCategoryReducer = (state = { subCategory: {} }, action) => {
  switch (action.type) {
    case NEW_SUB_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SUB_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        subCategory: action.payload.subcategory,
      };
    case NEW_SUB_CATEGORY_FAIL:
      return {
        loading: false,
        ...state,
        error: action.payload,
      };
    case NEW_SUB_CATEGORY_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const subCategoryReducer = (state = { subCategory: {} }, action) => {
  switch (action.type) {
    case DELETE_SUB_CATEGORY_REQUEST:
    case UPDATE_SUB_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_SUB_CATEGORY_FAIL:
    case UPDATE_SUB_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_SUB_CATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_SUB_CATEGORY_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
