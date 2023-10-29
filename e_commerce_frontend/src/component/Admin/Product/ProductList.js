import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { DELETE_PRODUCT_RESET } from "../../../constants/productConstants";
import "../Admin.css";

const ProductList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, products, loading } = useSelector((state) => state.products);
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

    if (isDeleted) {
      alert.success("Product Deleted!");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, alert, deleteError, isDeleted, navigate]);

  const deleteProductHandler = (id) => dispatch(deleteProduct(id));

  return (
    <>
      <MetaData title="All Products" />
      {loading === false && (
        <div className="row m-3">
          <div className="col">
            <div className="card">
              <div className="card-header">
                All Products
                <ul className="nav float-end">
                  <li className="nav-item">
                    <Link
                      to="/admin/product"
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
                        <th scope="col">Product Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Price</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Final Price</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Reviews</th>
                        <th scope="col">Action</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={11}>No Products Yet</td>
                        </tr>
                      ) : products.map((product, index) => (
                        <tr key={index} className="align-middle">
                          <th scope="row">{index + 1}.</th>
                          <td>{product._id}</td>
                          <td>{product.name}</td>
                          <td>{product.stock}</td>
                          <td>{product.price}</td>
                          <td>{product.discount}</td>
                          <td>{product.ratings}</td>
                          <td>{product.finalPrice}</td>
                          <td
                            id="productReviewCount"
                            className="align-middle"
                            onClick={() =>
                              navigate(`/admin/reviews/${product._id}`)
                            }
                          >
                            {product.reviews.length}&nbsp;
                          </td>
                          <td>
                            <input
                              onClick={() =>
                                navigate(`/admin/product/${product._id}`)
                              }
                              value="Edit"
                              readOnly
                              className="w-lg-25 btn btn-sm btn-primary"
                            />
                          </td>
                          <td>
                            <input
                              onClick={() => deleteProductHandler(product._id)}
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

export default ProductList;
