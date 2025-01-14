/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
  searchAdminProducts,
} from "../../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate, useLocation } from "react-router-dom";
import { DELETE_PRODUCT_RESET } from "../../../constants/productConstants";
import Loader from '../../../component/layout/Loader/Loader'
import "../Admin.css";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(100);

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, products, pagination, loading } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState(products)
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (location.state?.scrollPosition) {
      window.scrollTo(0, location.state.scrollPosition);
    }
  }, [location.state])

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

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

    dispatch(getAdminProducts(page, limit));
  }, [dispatch, error, alert, deleteError, isDeleted, navigate, page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 1500 && pagination?.currentPage <= pagination?.totalPages) {
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [pagination])

  const deleteProductHandler = (id) => dispatch(deleteProduct(id));

  const search = () => {
    dispatch(searchAdminProducts(searchTerm.toLowerCase()));
  }

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
                <div className="d-flex flex-row">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Product"
                    className="form-control"
                    aria-describedby={`basic-addon`}
                  />
                  <input
                    onClick={search}
                    type="button"
                    value="Search"
                    className="btn btn-primary mx-3"
                  />
                  <input
                    onClick={() => {
                      setSearchTerm("")
                      dispatch(getAdminProducts(page, limit))
                    }}
                    type="button"
                    value="Reset"
                    className="btn btn-danger"
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        {/* <th scope="col">Product Id</th> */}
                        <th scope="col">Name</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Price</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Final Price</th>
                        <th scope="col">Max Quantity</th>
                        <th scope="col">Category</th>
                        <th scope="col">Sub Category</th>
                        <th scope="col">Action</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td className="text-center fw-bold" colSpan={11}>
                            No Products Yet
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, index) => (
                          <tr key={index} className="align-middle">
                            <th scope="row">{index + 1}.</th>
                            {/* <td>{product._id}</td> */}
                            <td>{product.name}</td>
                            <td>{product.stock}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}</td>
                            <td>{product.finalPrice}</td>
                            <td>{product?.maxOrderQuantity > 0 ? product?.maxOrderQuantity : null}</td>
                            <td>{product.category}</td>
                            <td>{product?.subCategory?.name}&nbsp;</td>
                            <td>
                              <input
                                onClick={() => {
                                  const scrollPosition = window.scrollY;
                                  navigate(`/admin/product/${product._id}`, { state: { scrollPosition } })
                                }
                                }
                                value="Edit"
                                readOnly
                                className="w-lg-25 btn btn-sm btn-primary"
                              />
                            </td>
                            <td>
                              <input
                                onClick={() =>
                                  deleteProductHandler(product._id)
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
                  {
                    (pagination?.currentPage <= pagination?.totalPages) && <Loader small />
                  }
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
