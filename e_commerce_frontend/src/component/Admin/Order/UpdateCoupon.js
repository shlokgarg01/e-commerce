import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCouponDetails,
  updateCoupon,
  clearErrors,
} from "../../../actions/couponAction";
import { UPDATE_COUPON_RESET } from "../../../constants/couponConstants";

const UpdateCoupon = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const params = useParams();

  const [code, setCode] = useState();
  const [value, setValue] = useState();
  const [type, setType] = useState("");
  const [minCartValue, setMinCartValue] = useState();
  const [expires, setExpires] = useState("");

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.coupon);
  const { coupon, error } = useSelector((state) => state.couponDetails);
  const couponId = params.id;

  useEffect(() => {
    if (coupon && coupon._id !== couponId) {
      dispatch(getCouponDetails(couponId));
    } else {
      setCode(coupon.code);
      setValue(coupon.value);
      setType(coupon.type);
      setMinCartValue(coupon.minCartValue);
      setExpires(getNumberOfDaysFromNow(coupon.expires)); // in days
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Coupon Updated Successfully");
      navigate("/admin/coupons");
      dispatch({ type: UPDATE_COUPON_RESET });
    }
  }, [dispatch, error, alert, isUpdated, coupon, couponId, updateError, navigate]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("code", code);
    myForm.set("value", value);
    myForm.set("type", type);
    myForm.set("minCartValue", minCartValue);
    myForm.set("expires", Date.now() + expires * 24 * 60 * 60 * 1000); // expiry in milliseconds

    dispatch(updateCoupon(couponId, myForm));
  };

  const getNumberOfDaysFromNow = (date) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const timeDifference = targetDate - currentDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    return daysDifference + 1;
  };

  return (
    <Fragment>
      <MetaData title="Update Coupon" />
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alingItems: "center",
          padding: 20,
        }}
      >
        <div className="shadow card" style={{ width: "31rem" }}>
          <h5 className="card-header text-center">UPDATE COUPON</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="mb-3">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-label="couponCode"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Coupon Value</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  aria-label="value"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Minnimum Cart Value</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Minnimum Cart Value"
                  value={minCartValue}
                  onChange={(e) => setMinCartValue(e.target.value)}
                  aria-label="minCartValue"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Expires In (days)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Expires In (days)"
                  value={expires}
                  onChange={(e) => setExpires(e.target.value)}
                  aria-label="expires"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Coupon type</label>
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-select form-select"
                >
                  <option value="">Choose Coupon Type</option>
                  <option value="FLAT_VALUE">Flat Value</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
              </div>

              <input
                disabled={loading ? true : false}
                type="submit"
                value="Update"
                className="btn btn-primary"
              />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateCoupon;
