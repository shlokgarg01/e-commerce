import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import "../Admin.css";
import { DELETE_SUB_CATEGORY_RESET } from "../../../constants/subCategoryConstants";
import {
  deleteSubCategory,
  getAllSubCategories,
  clearErrors,
} from "../../../actions/subCategoryAction";

const SubCategoryList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, subCategories, loading } = useSelector(
    (state) => state.subCategories
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.subCategory
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
      alert.success("Sub Category Deleted!");
      navigate("/admin/subcategories");
      dispatch({ type: DELETE_SUB_CATEGORY_RESET });
    }

    dispatch(getAllSubCategories());
  }, [dispatch, error, alert, deleteError, isDeleted, navigate]);

  const deleteSubCategoryHandler = (id) => dispatch(deleteSubCategory(id));

  return (
    <>
      <MetaData title="All Categories" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <div className="card-header">
                All Sub Categories
                <ul className="nav float-end">
                  <li className="nav-item">
                    <Link
                      to="/admin/subcategory"
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
                        <th scope="col">Sub Category Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Action</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategories && subCategories.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={6}>
                            No Sub Categories Yet
                          </td>
                        </tr>
                      ) : (
                        <>
                        {/* <div>{subCategories.length}</div> */}
                        {subCategories &&
                        subCategories.map((sub_category, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            <td>{sub_category._id}</td>
                            <td>{sub_category.name}</td>
                            <td>{sub_category.category?.name}</td>
                            <td>
                              <input
                                onClick={() =>
                                  navigate(
                                    `/admin/subcategory/${sub_category._id}`
                                  )
                                }
                                value="Edit"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-primary"
                              />
                            </td>
                            <td>
                              <input
                                onClick={() =>
                                  deleteSubCategoryHandler(sub_category._id)
                                }
                                value="Delete"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-danger"
                              />
                            </td>
                          </tr>
                        ))}
                        </>
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

export default SubCategoryList;
