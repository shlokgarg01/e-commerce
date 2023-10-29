import React, { useEffect } from "react";
import Header from "./component/layout/Header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Login from "./component/User/Login";
import store from "./store";
import { loadUser } from "./actions/userAction";
import ProtectedRoute from "./component/Routes/ProtectedRoute";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/Product/ProductList";
import NewProduct from "./component/Admin/Product/NewProduct";
import UpdateProduct from "./component/Admin/Product/UpdateProduct";
import OrderList from "./component/Admin/Order/OrderList";
import ProcessOrder from "./component/Admin/Order/ProcessOrder";
import UsersList from "./component/Admin/User/UsersList";
import UpdateUser from "./component/Admin/User/UpdateUser";
import ReviewsList from "./component/Admin/Review/ReviewsList";
import NotFound from "./component/layout/NotFound/NotFound";
import CategoryList from "./component/Admin/Category/CategoryList";
import NewCategory from "./component/Admin/Category/NewCategory";
import UpdateCategory from "./component/Admin/Category/UpdateCategory";
import LoginVerfify from "./component/User/LoginVerfify";
import CouponsList from "./component/Admin/Order/CouponsList";
import NewCoupon from "./component/Admin/Order/NewCoupon";
import UpdateCoupon from "./component/Admin/Order/UpdateCoupon";
import SubCategoryList from "./component/Admin/SubCategory/SubCategoryList";
import UpdateSubCategory from "./component/Admin/SubCategory/UpdateSubCategory";
import NewSubCategory from "./component/Admin/SubCategory/NewSubCategory";

export default function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  });

  return (
    <Router>
      <Header />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/" element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute isAdmin />}>
          <Route exact path="/admin/dashboard" element={<Dashboard />} />

          <Route exact path="/admin/products" element={<ProductList />} />
          <Route exact path="/admin/product" element={<NewProduct />} />
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />

          <Route exact path="/admin/orders" element={<OrderList />} />
          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />

          <Route exact path="/admin/users" element={<UsersList />} />
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />

          <Route exact path="/admin/categories" element={<CategoryList />} />
          <Route exact path="/admin/category" element={<NewCategory />} />
          <Route
            exact
            path="/admin/category/:id"
            element={<UpdateCategory />}
          />

          <Route
            exact
            path="/admin/subcategories"
            element={<SubCategoryList />}
          />
          <Route exact path="/admin/subcategory" element={<NewSubCategory />} />
          <Route
            exact
            path="/admin/subcategory/:id"
            element={<UpdateSubCategory />}
          />

          <Route exact path="/admin/coupons" element={<CouponsList />} />
          <Route exact path="/admin/coupon" element={<NewCoupon />} />
          <Route exact path="/admin/coupon/:id" element={<UpdateCoupon />} />

          <Route
            exact
            path="/admin/reviews/:productId"
            element={<ReviewsList />}
          />
        </Route>

        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/login/verify" element={<LoginVerfify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
