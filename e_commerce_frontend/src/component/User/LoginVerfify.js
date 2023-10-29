import React, { Fragment, useEffect, useState } from "react";
import Loader from "../layout/Loader/Loader.js";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginViaOTP } from "../../actions/userAction.js";
import { useAlert } from "react-alert";

const LoginVerfify = () => {
  const [otp, setOTP] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation()

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      alert.success("Login Successful")
      navigate("/");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert, isAuthenticated, navigate]);

  const login = (e) => {
    e.preventDefault();

    dispatch(loginViaOTP(location.state.contactNumber, otp));
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
              <form onSubmit={login} className="d-flex flex-column">
                <div className="form-floating mb-3">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <MdOutlineMailOutline />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      aria-label="otp"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>
                </div>
                <br />
                <input
                  type="submit"
                  value="Login"
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

export default LoginVerfify 