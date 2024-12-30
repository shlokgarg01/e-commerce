import {
  CLEAR_ERRORS,
  GET_BANNERS_FAIL,
  GET_BANNERS_REQUEST,
  GET_BANNERS_SUCCESS,
  UPDATE_BANNERS_FAIL,
  UPDATE_BANNERS_REQUEST,
  UPDATE_BANNERS_RESET,
  UPDATE_BANNERS_SUCCESS,
} from "../constants/constantsConstants";

export const bannersReducer = (state = { banners: [] }, action) => {
  switch (action.type) {
    case GET_BANNERS_REQUEST:
      return {
        loading: true,
        banners: [],
      };
    case GET_BANNERS_SUCCESS:
      return {
        loading: false,
        banners: action.payload.banners,
      };
    case GET_BANNERS_FAIL:
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

export const updateBannerReducer = (state = { banners: [] }, action) => {
  switch (action.type) {
    case UPDATE_BANNERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_BANNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_BANNERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_BANNERS_RESET:
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
