import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAllCategories } from "../../../actions/categoryAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import "../Admin.css";
import { DELETE_CATEGORY_RESET } from "../../../constants/categoryConstants";
import { deleteCategory } from "../../../actions/categoryAction";

const CategoryList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, categories, loading } = useSelector(
    (state) => state.categories
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.category
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
      alert.success("Category Deleted!");
      navigate("/admin/categories");
      dispatch({ type: DELETE_CATEGORY_RESET });
    }

    dispatch(getAllCategories());
  }, [dispatch, error, alert, deleteError, isDeleted, navigate]);

  const deleteCategoryHandler = (id) => dispatch(deleteCategory(id));

  return (
    <>
      <MetaData title="All Categories" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <div className="card-header">
                All Categories
                <ul className="nav float-end">
                  <li className="nav-item">
                    <Link
                      to="/admin/category"
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
                        <th scope="col">Category Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Order</th>
                        <th scope="col">Action</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={5}>
                            No Categories Yet
                          </td>
                        </tr>
                      ) : (
                        categories.map((category, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            <td>{category._id}</td>
                            <td>{category.name}</td>
                            <td>{category.order}</td>
                            <td>
                              <input
                                onClick={() =>
                                  navigate(`/admin/category/${category._id}`)
                                }
                                value="Edit"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-primary"
                              />
                            </td>
                            <td>
                              <input
                                onClick={() =>
                                  deleteCategoryHandler(category._id)
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

export default CategoryList;
