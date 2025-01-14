import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { getProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { getAllUsers } from "../../actions/userAction";
import { getAllCategories } from "../../actions/categoryAction";
import { getAllOrders } from "../../actions/orderAction";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, productsCount } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);
  const { categories } = useSelector((state) => state.categories);

  let totalAmount = 0;
  orders && orders.forEach((item) => (totalAmount += item.totalPrice));

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getAllUsers(1, 10));
    dispatch(getAllCategories());
    dispatch(getAllOrders(1, 10));
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Home - Parchun King" />

          <div className="container d-flex flex-row flex-wrap justify-content-center mt-5">
            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
              <b className="mb-2" style={{fontSize: 22}}>Total Orders</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "lightgreen",
                  fontSize: 34,
                }}
              >
                {orders && orders.length}
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
            <b className="mb-2" style={{fontSize: 22}}>Total Order Amount</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "lightblue",
                  fontSize: 34,
                }}
              >
                {totalAmount}
              </div>
            </div>
          </div>

          <div className="container d-flex flex-row flex-wrap justify-content-center mt-5">
            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
            <b className="mb-2" style={{fontSize: 22}}>Total Products</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "#fcf44e",
                  fontSize: 34,
                }}
              >
                {productsCount}
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
            <b className="mb-2" style={{fontSize: 22}}>Total Categories</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "#c88aff",
                  fontSize: 34,
                }}
              >
                {categories && categories.length}
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
            <b className="mb-2" style={{fontSize: 22}}>Total Users</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "#ff8ac0",
                  fontSize: 34,
                }}
              >
                {users && users.length}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
