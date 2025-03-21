/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, clearErrors } from "../../../actions/categoryAction";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UPDATE_PRODUCT_RESET } from "../../../constants/productConstants";
import {
  updateProduct,
  getProductDetails,
} from "../../../actions/productAction";
import { getSubCategoryByCategory } from "../../../actions/subCategoryAction";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation()
  const params = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState();
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState();
  const [maxOrderQuantity, setMaxOrderQuantity] = useState();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [trending, setTrending] = useState(false);
  const [order, setOrder] = useState(null);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);

  const { categories } = useSelector((state) => state.categories);
  const { subCategories } = useSelector(
    (state) => state.subCategoriesByCategory
  );

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);
  const { product, error } = useSelector((state) => state.productDetails);
  const productId = params.id;

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setDiscount(product.discount);
      setStock(product.stock);
      setMaxOrderQuantity(product.maxOrderQuantity)
      setCategory(product.category);
      setSubCategory(product.subCategory?._id);
      setTrending(product.trending);
      setOrder(product.order);
      setFavourite(product.favourite);
      setOldImages(product.images);

      // let file = product.images[0].public_url
      //   const reader = new FileReader();
      //   reader.onload = () => {
      //     if (reader.readyState === 2) {
      //       setImages((old) => [...old, reader.result]);
      //     }
      //   };
      //   reader.readAsDataURL(file);
      // console.log(images)
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      const scrollPosition = location.state?.scrollPosition || 0;
      alert.success("Product Updated Successfully");
      navigate("/admin/products", { state: { scrollPosition } });
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }

    dispatch(getAllCategories());
  }, [
    dispatch,
    error,
    alert,
    isUpdated,
    product,
    productId,
    updateError,
    navigate,
  ]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = {
      name,
      price,
      discount,
      description,
      stock,
      maxOrderQuantity,
      category,
      subCategory,
      trending,
      favourite,
      order,
      images: [],
    };
    images.forEach((image) => {
      myForm.images.push(image);
    });
    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const fetchSubCategories = async (category_id) => {
    dispatch(getSubCategoryByCategory(category_id));
  };

  return (
    <Fragment>
      <MetaData title="Update Product" />
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alingItems: "center",
          padding: 20,
        }}
      >
        <div className="shadow card" style={{ width: "31rem" }}>
          <h5 className="card-header text-center">UPDATE PRODUCT</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="name"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  aria-label="stock"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    aria-label="price"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Discount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    aria-label="discount"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="description"
                  aria-describedby="basic-addon1"
                  rows="2"
                  cols="30"
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const selected_element =
                        e.target.childNodes[e.target.selectedIndex];
                      const category_id = selected_element.getAttribute("id");
                      setCategory(e.target.value);
                      fetchSubCategories(category_id);
                    }}
                    className="form-select form-select"
                  >
                    <option value="">Choose Category</option>
                    {categories.map((category) => (
                      <option
                        key={category._id}
                        id={category._id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-6 mb-3">
                  <label className="form-label">Order</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Product Order"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      aria-label="order"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                {subCategories?.length > 0 && (
                  <div className="col-6 mb-3">
                    <label className="form-label">Sub Category</label>
                    <select
                      onChange={(e) => {
                        const selected_element =
                          e.target.childNodes[e.target.selectedIndex];
                        const subCategory_id =
                          selected_element.getAttribute("id");
                        setSubCategory(subCategory_id);
                      }}
                      className="form-select form-select"
                    >
                      <option key="" id="" value="">
                        Choose Sub Category
                      </option>
                      {subCategories.map((subcategory) => (
                        <option
                          key={subcategory._id}
                          id={subcategory._id}
                          value={subcategory.name}
                          selected={subcategory._id === subCategory}
                        >
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Maximum Quantity</label><br />
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Quantity"
                    value={maxOrderQuantity}
                    onChange={(e) => {
                      setMaxOrderQuantity(e.target.value)
                    }}
                    aria-label="maxOrderQuantity"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>

              <div className="mb-3 form-check">
                <input
                  onChange={(e) => setFavourite(e.target.checked)}
                  type="checkbox"
                  className="form-check-input"
                  id="favourite"
                  checked={favourite}
                />
                <label className="form-check-label" htmlFor="favourite">
                  favourite
                </label>
              </div>

              <div className="mb-3 form-check">
                <input
                  onChange={(e) => setTrending(e.target.checked)}
                  type="checkbox"
                  className="form-check-input"
                  id="trending"
                  checked={trending}
                />
                <label className="form-check-label" htmlFor="trending">
                  Trending
                </label>
              </div>

              <div id="createProductFormFile" className="mb-3">
                <label className="form-label">Product Images</label>
                <input
                  type="file"
                  className="form-control"
                  name="avatar"
                  accept="image/*"
                  multiple
                  onChange={updateProductImagesChange}
                />
              </div>

              <div
                id="oldProductFormImage"
                className="input-group mb-3 d-flex flex-row text-center"
              >
                {oldImages &&
                  oldImages.map((image, index) => (
                    <img
                      style={{ height: 100, width: 100, marginRight: 16 }}
                      key={index}
                      src={image.url}
                      alt="Current Product"
                    />
                  ))}
              </div>

              <div
                id="updateProductFormImage"
                className="input-group mb-3 d-flex flex-row text-center"
              >
                {imagePreview.map((image, index) => (
                  <img
                    style={{ height: 100, width: 100, marginRight: 16 }}
                    key={index}
                    src={image}
                    alt="Product"
                  />
                ))}
              </div>

              <input
                disabled={loading ? true : false}
                id="createProductBtn"
                type="submit"
                value="Update"
                className="btn btn-primary"
              />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
