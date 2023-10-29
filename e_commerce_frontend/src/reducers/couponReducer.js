import { GET_COUPONS_FAIL, GET_COUPONS_REQUEST, GET_COUPONS_SUCCESS, CLEAR_ERRORS, COUPON_DETAILS_REQUEST, COUPON_DETAILS_SUCCESS, COUPON_DETAILS_FAIL, NEW_COUPON_REQUEST, NEW_COUPON_SUCCESS, NEW_COUPON_FAIL, NEW_COUPON_RESET, DELETE_COUPON_REQUEST, UPDATE_COUPON_REQUEST, DELETE_COUPON_SUCCESS, UPDATE_COUPON_SUCCESS, DELETE_COUPON_FAIL, UPDATE_COUPON_FAIL, DELETE_COUPON_RESET, UPDATE_COUPON_RESET } from "../constants/couponConstants";

export const couponsReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case GET_COUPONS_REQUEST:
      return {
        loading: true,
        coupons: [],
      };
    case GET_COUPONS_SUCCESS:
      return {
        loading: false,
        coupons: action.payload.coupons,
        couponsCount: action.payload.couponsCount
      };
    case GET_COUPONS_FAIL:
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

export const couponDetailsReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case COUPON_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case COUPON_DETAILS_SUCCESS:
      return {
        loading: false,
        coupon: action.payload,
      };
    case COUPON_DETAILS_FAIL:
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

export const newCouponReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case NEW_COUPON_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_COUPON_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        coupon: action.payload.coupon,
      };
    case NEW_COUPON_FAIL:
      return {
        loading: false,
        ...state,
        error: action.payload,
      };
    case NEW_COUPON_RESET:
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

export const couponReducer = (state = { coupon: {} }, action) => {
  switch (action.type) {
    case DELETE_COUPON_REQUEST:
    case UPDATE_COUPON_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_COUPON_FAIL:
    case UPDATE_COUPON_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_COUPON_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_COUPON_RESET:
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
