import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_USER_RESET } from "../../../constants/userConstants";
import { updateUser, clearErrors, getUserDetails } from "../../../actions/userAction";

const UpdateUser = () => {
  const { user, error, loading } = useSelector((state) => state.userDetails);
  const { error: updateError, isUpdated, loading: updateLoading } = useSelector((state) => state.profile);
  const userId = useParams().id;
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const alert = useAlert();

  const [role, setRole] = useState(user && user.role)

  const updateUserHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("role", role);
    dispatch(updateUser(userId, myForm));
  };

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
      alert.success("User Updated Successfully");
      navigate("/admin/users")
      dispatch({ type: UPDATE_USER_RESET });
    }

    dispatch(getUserDetails(userId))

  }, [dispatch, alert, error, userId, isUpdated, updateError, navigate]);

  return (
    <Fragment>
      <MetaData title="UPDATE USER" />
      {loading ? (
        <Loader />
      ) : (
        <div className="d-flex flex-row flex-wrap justify-content-center">
          <div className="mt-5 shadow card mx-2" style={{ width: "31rem" }}>
            <h5 className="card-header text-center">UPDATE USER</h5>
            <div className="card-body">
              <div className="orderDetailsContainerBox">
                <div className="d-flex flex-row">
                  <b>Name:&nbsp;</b>
                  <span>{user && user.name}</span>
                </div>
                <div className="d-flex flex-row">
                  <b>Email:&nbsp;</b>
                  <span>
                    {user && user.email}
                  </span>
                </div>
                <div className="d-flex flex-row">
                  <b>Contact Number:&nbsp;</b>
                  <span>
                    {user && user.contactNumber}
                  </span>
                </div>
                <div className="d-flex flex-row">
                  <b>Role:&nbsp;</b>
                  <span
                    className={
                      user && user.role === "admin"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {user && user.role}
                  </span>
                </div>
              </div>

              <form
                onSubmit={updateUserHandler}
                className="d-flex flex-column mt-2"
              >
                <div className="input-group">
                  <div className="input-group mb-3">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-select form-select"
                    >
                      <option value="">Choose Role</option>
                      {user.role === "admin" && (
                        <option value="user">User</option>
                      )}

                      {user.role === "user" && (
                        <option value="admin">Admin</option>
                      )}
                    </select>
                  </div>
                </div>
                <input
                  disabled={updateLoading ? true : false}
                  type="submit"
                  value="Update User"
                  className="btn btn-primary mt-2"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UpdateUser