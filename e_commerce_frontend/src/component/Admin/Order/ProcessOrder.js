import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { UPDATE_ORDER_RESET } from "../../../constants/orderConstants";
import { useParams } from "react-router-dom";
import { Enums } from "../../../utils/Enums";
import { Capitalize } from "../../../helpers/StringHelpers";

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);
  const orderId = useParams().id;
  const dispatch = useDispatch();
  const alert = useAlert();

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(orderId, myForm));
  };

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(orderId));
  }, [dispatch, alert, error, orderId, isUpdated, updateError]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      {loading ? (
        <Loader />
      ) : (
        <div className="d-flex flex-row flex-wrap justify-content-center">
          <div className="mt-5 shadow card mx-2" style={{ width: "31rem" }}>
            <h5 className="card-header text-center">ORDER DETAILS</h5>
            <div className="card-body">
              <div className="orderDetailsContainerBox">
                <div className="d-flex flex-row">
                  <b>Name:&nbsp;</b>
                  <span>{order.user && order.user.name}</span>
                </div>
                <div className="d-flex flex-row">
                  <b>Phone:&nbsp;</b>
                  <span>
                    {order.shippingAddress &&
                      order.shippingAddress.contactNumber}
                  </span>
                </div>
                <div className="d-flex flex-row">
                  <b>Address:&nbsp;</b>
                  <span>
                    {order.shippingAddress &&
                      `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`}
                  </span>
                </div>
                <div className="d-flex flex-row">
                  <b>Status:&nbsp;</b>
                  <span
                    className={
                      order.orderStatus &&
                      order.orderStatus === Enums.ORDER_STATUS.DELIVERED
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {order.orderStatus && Capitalize(order.orderStatus)}
                  </span>
                </div>
                <div>
                  <b>Amount:&nbsp;</b>
                  <span>₹&nbsp;{order.totalPrice && order.totalPrice}</span>
                </div>
                {order.coupon && (
                  <div>
                    <b>Coupon Used:&nbsp;</b>
                    <span>&nbsp;{order.coupon}</span>
                  </div>
                )}

                <div>
                  <p
                    className={
                      order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "text-success my-3 fw-bold"
                        : "text-danger my-3 fw-bold"
                    }
                  >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>
              </div>

              <form
                onSubmit={updateOrderSubmitHandler}
                className="d-flex flex-column"
              >
                <div className="input-group mb-3">
                  <div className="input-group mb-3">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="form-select form-select"
                    >
                      <option value="">Choose Status</option>
                      {order.orderStatus === Enums.ORDER_STATUS.RECEIVED && (
                        <option value={Enums.ORDER_STATUS.DISPATCHED}>
                          Dispatched
                        </option>
                      )}

                      {order.orderStatus === Enums.ORDER_STATUS.DISPATCHED && (
                        <option value={Enums.ORDER_STATUS.DELIVERED}>
                          Delivered
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <input
                  disabled={loading ? true : false}
                  id="createProductBtn"
                  type="submit"
                  value="Update Status"
                  className="btn btn-primary"
                />
              </form>
            </div>
          </div>

          <div className="mt-5 shadow card mx-2" style={{ width: "31rem" }}>
            <h5 className="card-header text-center">Order Items</h5>
            <div className="card-body">
              <div className="confirmCartItems">
                <div className="confirmCartItemsContainer">
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.product}>
                        <img
                          style={{ height: 100, width: 100 }}
                          src={item.image}
                          alt="Product"
                        />
                        {item.name}&emsp;
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                  Total Price -{" "}
                  <b>
                    ₹{" "}
                    {order.orderItems?.reduce((sum, currentValue) => {
                      return sum + currentValue.price * currentValue.quantity;
                    }, 0)}
                  </b><br />
                  Shipping Price - <b>₹ {order.shippingPrice}</b>
                  <br />
                  Tax - <b>₹ {order.taxPrice}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProcessOrder;
