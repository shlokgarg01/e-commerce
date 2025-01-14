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
  allUsersReducer,
  profileReducer,
  userDetailsReducer,
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
import { newSubCategoryReducer, subCategoriesForCategoryReducer, subCategoriesReducer, subCategoryDetailsReducer, subCategoryReducer } from "./reducers/subCategoryReducer";
import { bannersReducer, statsReducer, updateBannerReducer } from "./reducers/constantsReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,

  productReviews: productReviewsReducer,
  review: reviewReducer,

  allUsers: allUsersReducer,
  user: userReducer,
  userDetails: userDetailsReducer,
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
  subCategoriesByCategory: subCategoriesForCategoryReducer,

  coupons: couponsReducer,
  newCoupon: newCouponReducer,
  couponDetails: couponDetailsReducer,
  coupon: couponReducer,

  banners: bannersReducer,
  updateBanners: updateBannerReducer,
  stats: statsReducer,
});

let initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
