import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { getAllStats } from "../../actions/constantsActions";

const Home = () => {
  const dispatch = useDispatch();
  const {loading, stats} = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getAllStats())
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
                {stats && stats.totalOrders}
              </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center mx-4">
            <b className="mb-2" style={{fontSize: 22}}>Last Month Amount</b>
              <div
                className="productsCount rounded-circle fw-bold d-flex flex-row justify-content-center align-items-center"
                style={{
                  height: 130,
                  width: 130,
                  backgroundColor: "lightblue",
                  fontSize: 34,
                }}
              >
                {stats?.thirtyDaysOrderAmount}
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
                {stats && stats.totalProducts}
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
                {stats && stats.totalCategories}
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
                {stats && stats.totalUsers}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
