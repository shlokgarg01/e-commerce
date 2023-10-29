import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllOrders,
  clearErrors,
  // deleteOrder,
} from "../../../actions/orderAction";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { Enums } from "../../../utils/Enums";
import { Capitalize } from "../../../helpers/StringHelpers";
// import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const OrderList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, orders, loading } = useSelector((state) => state.allOrders);
  // const { error: deleteError, isDeleted } = useSelector(
  //   (state) => state.order
  // );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    // if (deleteError) {
    //   alert.error(deleteError);
    //   dispatch(clearErrors());
    // }

    // if(isDeleted) {
    //   alert.success("Product Deleted!")
    //   navigate("/admin/products")
    //   dispatch({type: DELETE_PRODUCT_RESET})
    // }

    dispatch(getAllOrders());
  }, [dispatch, error, alert]);

  // const deleteOrderHandler = (id) => {
  //   dispatch(deleteOrder(id))
  // };

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
                        orders && orders.map((order, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            <td>{order._id}</td>
                            <td
                              className={
                                order.orderStatus === Enums.ORDER_STATUS.DELIVERED
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {Capitalize(order.orderStatus)}
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
                            <td>{new Date(order.createdAt).toDateString()}</td>
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
