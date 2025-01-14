import {
  ALL_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_RESET,
  UPDATE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_RESET,
  DELETE_ORDER_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

// fetch All Orders
export const allOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        loading: false,
        orders: state.orders,
        pagination: {}
      };
    case ALL_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: [...state.orders, ...action.payload],
        pagination: action.pagination,
      };
    case ALL_ORDERS_FAIL:
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

// Update Order
export const orderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case UPDATE_ORDER_REQUEST:
    case DELETE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_ORDER_FAIL:
    case DELETE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ORDER_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_ORDER_RESET:
      return {
        ...state,
        isDeleted: false,
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

export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case ORDER_DETAILS_FAIL:
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