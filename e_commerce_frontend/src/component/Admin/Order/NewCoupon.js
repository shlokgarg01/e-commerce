import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NEW_COUPON_RESET } from "../../../constants/couponConstants";
import { createCoupon, clearErrors } from "../../../actions/couponAction";

const NewCoupon = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [value, setValue] = useState();
  const [type, setType] = useState("");
  const [minCartValue, setMinCartValue] = useState();
  const [expires, setExpires] = useState("");

  const { loading, error, success } = useSelector((state) => state.newCoupon);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Coupon Created Successfully");
      navigate("/admin/coupons");
      dispatch({ type: NEW_COUPON_RESET });
    }
  }, [dispatch, error, alert, success, navigate]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("code", code);
    myForm.set("value", value);
    myForm.set("type", type);
    myForm.set("minCartValue", minCartValue);
    myForm.set("expires", Date.now() + (expires * 24 * 60 * 60 * 1000)); // expiry in milliseconds

    dispatch(createCoupon(myForm));
  };

  return (
    <Fragment>
      <MetaData title="New Coupon" />
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
          <h5 className="card-header text-center">CREATE COUPON</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    aria-label="code"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Coupon Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="value"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="input-group mb-3">
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
              </div>
              <div className="input-group mb-3">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Expiry in Days"
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                    aria-label="expires"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>

              <div className="input-group mb-3">
                <div className="input-group mb-3">
                  <select
                    required
                    onChange={(e) => setType(e.target.value)}
                    className="form-select form-select"
                  >
                    <option value="">Choose Coupon Type</option>
                    <option value="FLAT_VALUE">Flat Value</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
              </div>

              <input
                disabled={loading ? true : false}
                id="createCouponBtn"
                type="submit"
                value="Create Coupon"
                className="btn btn-primary"
              />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewCoupon;
