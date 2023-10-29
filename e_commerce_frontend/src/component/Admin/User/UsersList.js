import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllUsers,
  clearErrors,
  // deleteUser
} from "../../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { Capitalize } from '../../../helpers/StringHelpers'
// import { DELETE_USER_RESET } from "../../constants/userConstants";

const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    // if(isDeleted) {
    //   alert.success("User Deleted!")
    //   navigate("/admin/users")
    //   dispatch({type: DELETE_USER_RESET})
    // }

    dispatch(getAllUsers());
  }, [dispatch, error, alert, deleteError, isDeleted]);

  // const deleteUserHandler = id => dispatch(deleteUser(id))

  return (
    <>
      <MetaData title="All Users" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <h5 className="card-header text-center">All Users</h5>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">User Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Contact Number</th>
                        <th scope="col">Role</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={7}>No Users Yet</td>
                        </tr>
                      ) : users.map((user, index) => (
                        <tr key={index} className="align-middle">
                          <th scope="row">{index + 1}.</th>
                          <td>{user._id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.contactNumber}</td>
                          <td
                            className={
                              user.role === "admin"
                                ? "text-success fw-bold"
                                : "text-danger"
                            }
                          >
                            {Capitalize(user.role)}
                          </td>
                          <td>
                            <input
                              onClick={() =>
                                navigate(`/admin/user/${user._id}`)
                              }
                              readOnly
                              value="Edit"
                              className="w-lg-50 btn btn-sm btn-primary"
                            />
                          </td>
                          {/* <td><Link onClick={() => deleteUserHandler(user._id)}>Delete</Link></td> */}
                        </tr>
                      ))}
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

export default UsersList;
