import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, clearErrors } from "../../../actions/categoryAction";
import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../../constants/productConstants";
import { createProduct } from "../../../actions/productAction";
import { getSubCategoryByCategory } from '../../../actions/subCategoryAction'

const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState();
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState();
  const [maxOrderQuantity, setMaxOrderQuantity] = useState();
  const [images, setImages] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [trending, setTrending] = useState(false);
  const [order, setOrder] = useState(null);

  const { categories } = useSelector((state) => state.categories);
  const { error, success } = useSelector((state) => state.newProduct);
  const { subCategories } = useSelector(state => state.subCategoriesByCategory)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      navigate("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }

    dispatch(getAllCategories());
  }, [dispatch, error, alert, success, navigate]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = {
      name, price, discount, description, stock, maxOrderQuantity, category, subCategory, trending, favourite, order, images: []
    }
    images.forEach((image) => {
      myForm.images.push(image);
    });
    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

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
    dispatch(getSubCategoryByCategory(category_id))
  }

  return (
    <Fragment>
      <MetaData title="New Product" />
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
          <h5 className="card-header text-center">CREATE PRODUCT</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
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
              </div>
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
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
              </div>

              <div className="row">
                <div className="col-sm-6 mb-3">
                  <div className="input-group mb-3">
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
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="input-group mb-3">
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
              </div>

              <div className="input-group mb-3">
                <div className="input-group mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="description"
                    aria-describedby="basic-addon1"
                    rows="1"
                    cols="30"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 mb-3">
                  <div className="input-group mb-3">
                    <select
                      onChange={(e) => {
                        const selected_element = e.target.childNodes[e.target.selectedIndex]
                        const category_id = selected_element.getAttribute('id');
                        setCategory(e.target.value)
                        fetchSubCategories(category_id)
                      }}
                      className="form-select form-select"
                    >
                      <option value="">Choose Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name} id={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="input-group mb-3">
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

                {subCategories?.length > 0 && (
                  <div className="col-6 mb-3">
                    <div className="input-group mb-3">
                      <select
                        onChange={(e) => {
                          const selected_element = e.target.childNodes[e.target.selectedIndex]
                          const subCategory_id = selected_element.getAttribute('id');
                          setSubCategory(subCategory_id)
                        }}
                        className="form-select form-select"
                      >
                        <option value="">Choose Sub Category</option>
                        {subCategories.map((subcategory) => (
                          <option key={subcategory._id} id={subcategory._id} value={subcategory.name}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-floating mb-3">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Quantity"
                    value={maxOrderQuantity}
                    onChange={(e) => setMaxOrderQuantity(e.target.value)}
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
                />
                <label className="form-check-label" htmlFor="trending">
                  Trending
                </label>
              </div>

              <div id="createProductFormFile" className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="avatar"
                  accept="image/*"
                  multiple
                  required
                  onChange={createProductImagesChange}
                />
                <label className="input-group-text">Upload</label>
              </div>

              <div className="input-group mb-3 d-flex flex-row text-center">
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
                id="createProductBtn"
                type="submit"
                value="Create"
                className="btn btn-primary"
              />
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
