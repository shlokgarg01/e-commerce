/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllOrders,
  clearErrors,
} from "../../../actions/orderAction";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { Enums } from "../../../utils/Enums";
import { Capitalize } from "../../../helpers/StringHelpers";
import { getDateFromDateString } from "../../../helpers/DateHelper";
import Loader from "../../layout/Loader/Loader";

const OrderList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(100);

  const { error, orders, pagination, loading } = useSelector((state) => state.allOrders);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 550 && pagination?.currentPage <= pagination?.totalPages) {
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [pagination])

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllOrders(page, limit));
  }, [dispatch, error, alert, page, limit]);

  return (
    <>
      <MetaData title="All Orders" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <h5 className="card-header text-center">All Orders</h5>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Order Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Contact</th>
                        <th scope="col">Order Status</th>
                        <th scope="col">Items Quantity</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders && orders.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={8}>No Orders Yet</td>
                        </tr>
                      ) : (
                        orders && orders.reverse().map((order, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            <td>{order._id}</td>
                            <td>{order.user.name}</td>
                            <td>{order.user.contactNumber}</td>
                            <td
                              className={
                                order.orderStatus === Enums.ORDER_STATUS.DELIVERED
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {Capitalize(order.orderStatus || Enums.ORDER_STATUS.RECEIVED)}
                            </td>
                            <td>{order.orderItems.length}</td>
                            <td>₹ {order.totalPrice}</td>
                            <td
                              className={
                                order.paymentInfo.status === "succeeded"
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {order.paymentInfo.status === "succeeded"
                                ? "PAID"
                                : "NOT PAID"}
                            </td>
                            <td>{getDateFromDateString(order.createdAt)}</td>
                            <td>
                              <input
                                onClick={() =>
                                  navigate(`/admin/order/${order._id}`)
                                }
                                readOnly
                                value="Change Status"
                                className="w-lg-50 btn btn-sm btn-primary"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {
                    (pagination?.currentPage <= pagination?.totalPages) && <Loader small />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
