import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, clearErrors } from "../../../actions/categoryAction";
import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../../constants/productConstants";
import { createProduct } from "../../../actions/productAction";

const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState();
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState();
  const [images, setImages] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);
  const [category, setCategory] = useState("");

  const { categories } = useSelector((state) => state.categories);
  const { loading, error, success } = useSelector((state) => state.newProduct);

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

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("discount", discount);
    myForm.set("description", description);
    myForm.set("stock", stock);
    myForm.set("category", category);

    images.forEach((image) => {
      myForm.append("images", image);
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
              <div className="input-group mb-3">
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
              <div className="input-group mb-3">
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

              <div className="input-group mb-3">
                <div className="input-group mb-3">
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select form-select"
                  >
                    <option value="">Choose Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                disabled={loading ? true : false}
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
