import React, { Fragment, useEffect, useState } from "react";
import Loader from "../layout/Loader/Loader.js";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, sendOPTPLogin } from "../../actions/userAction.js";
import { useAlert } from "react-alert";

const Login = () => {
  const [contactNumber, setContactNumber] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, loading, isAuthenticated, otpSent } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (otpSent) {
      alert.success("OTP Sent");
      navigate("/login/verify", { state: { contactNumber } });
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert, isAuthenticated, otpSent, contactNumber, navigate]);

  const sendOTP = (e) => {
    e.preventDefault();

    dispatch(sendOPTPLogin(contactNumber));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div
          className="mt-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alingItems: "center",
            padding: 20,
          }}
        >
          <div className="shadow card" style={{ width: "40rem" }}>
            <h5 className="card-header text-center">LOGIN</h5>
            <div className="card-body">
              <form onSubmit={sendOTP} className="d-flex flex-column">
                <div className="form-floating mb-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <MdOutlineMailOutline />
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      aria-label="contactNumber"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>
                </div>
                <Link style={{ textDecoration: "none" }} onClick={sendOTP}>
                  Resend OTP
                </Link>
                <br />
                <input
                  type="submit"
                  value="Send OTP"
                  className="btn btn-primary"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
