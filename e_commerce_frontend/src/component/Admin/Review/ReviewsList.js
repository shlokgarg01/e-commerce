import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllReviews,
  deleteReviews,
  clearErrors,
} from "../../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { DELETE_REVIEW_RESET } from "../../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";

const ReviewsList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = useParams().productId;

  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
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
      alert.success("Review Deleted!");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }

    dispatch(getAllReviews(productId));
  }, [dispatch, error, alert, deleteError, isDeleted, navigate, productId]);

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId));
  };

  return (
    <>
      <MetaData title="All Reviews" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <h5 className="card-header text-center">Product Reviews</h5>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-responsive">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Review Id</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {reviews.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={6}>No Reviews Yet</td>
                        </tr>
                      ) : reviews.map((review, index) => (
                        <tr key={index} className="align-middle">
                          <th scope="row">{index + 1}.</th>
                          <td>{review._id}</td>
                          <td>{review.name}</td>
                          <td>{review.comment}</td>
                          <td
                            className={
                              review.rating >= 3
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {review.rating}
                          </td>
                          <td>
                            <input
                              onClick={() => deleteReviewHandler(review._id)}
                              value="Delete"
                              readOnly
                              className="w-lg-25 btn btn-sm btn-danger"
                            />
                          </td>
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

export default ReviewsList;
