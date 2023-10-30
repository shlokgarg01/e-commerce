import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  newProductReducer,
  productDetailsReducer,
  productsReducer,
  productReducer,
  productReviewsReducer,
  reviewReducer,
} from "./reducers/productReducer";
import {
  allUsersReduceer,
  profileReducer,
  userDetailsReduceer,
  userReducer,
} from "./reducers/userReducer";
import {
  categoriesReducer,
  categoryDetailsReducer,
  categoryReducer,
  newCategoryReducer,
} from "./reducers/categoryReducer";
import {
  allOrdersReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
import {
  couponDetailsReducer,
  couponReducer,
  couponsReducer,
  newCouponReducer,
} from "./reducers/couponReducer";
import { newSubCategoryReducer, subCategoriesReducer, subCategoryDetailsReducer, subCategoryReducer } from "./reducers/subCategoryReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,

  productReviews: productReviewsReducer,
  review: reviewReducer,

  allUsers: allUsersReduceer,
  user: userReducer,
  userDetails: userDetailsReduceer,
  profile: profileReducer,

  allOrders: allOrdersReducer,
  orderDetails: orderDetailsReducer,
  order: orderReducer,

  categories: categoriesReducer,
  newCategory: newCategoryReducer,
  categoryDetails: categoryDetailsReducer,
  category: categoryReducer,

  subCategories: subCategoriesReducer,
  newSubCategory: newSubCategoryReducer,
  subCategoryDetails: subCategoryDetailsReducer,
  subCategory: subCategoryReducer,

  coupons: couponsReducer,
  newCoupon: newCouponReducer,
  couponDetails: couponDetailsReducer,
  coupon: couponReducer,
});

let initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
