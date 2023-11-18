import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import "../Admin.css";
import { DELETE_COUPON_RESET } from "../../../constants/couponConstants";
import { deleteCoupon, getAllCoupons, clearErrors } from "../../../actions/couponAction";

const CouponsList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, coupons, loading } = useSelector(
    (state) => state.coupons
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.coupon
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

    if (isDeleted) {
      alert.success("Coupon Deleted!");
      navigate("/admin/coupons");
      dispatch({ type: DELETE_COUPON_RESET });
    }

    dispatch(getAllCoupons());
  }, [dispatch, error, alert, deleteError, isDeleted, navigate]);

  const deleteCouponHandler = (id) => dispatch(deleteCoupon(id));

  return (
    <>
      <MetaData title="All Coupons" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <div className="card-header">
                All Coupons
                <ul className="nav float-end">
                  <li className="nav-item">
                    <Link
                      to="/admin/coupon"
                      className="text-decoration-none fw-bold text-success"
                    >
                      +
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Coupon Code</th>
                        <th scope="col">Type</th>
                        <th scope="col">Value</th>
                        <th scope="col">Min Cart Amount</th>
                        <th scope="col">Expires On</th>
                        <th scope="col">Action</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons && coupons.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={8}>
                            No Coupons Yet
                          </td>
                        </tr>
                      ) : (
                        coupons.map((coupon, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            <td>{coupon.code}</td>
                            <td className={
                                coupon.type === "FLAT_VALUE"
                                  ? "text-success"
                                  : "text-danger"
                              }>{coupon.type}</td>
                            <td>{coupon.value}</td>
                            <td>₹ {coupon.minCartValue}</td>
                            <td>{new Date(coupon.expires).toDateString()}</td>
                            <td>
                              <input
                                onClick={() =>
                                  navigate(`/admin/coupon/${coupon._id}`)
                                }
                                value="Edit"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-primary"
                              />
                            </td>
                            <td>
                              <input
                                onClick={() =>
                                  deleteCouponHandler(coupon._id)
                                }
                                value="Delete"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-danger"
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

export default CouponsList