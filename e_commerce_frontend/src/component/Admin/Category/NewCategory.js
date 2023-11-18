import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NEW_CATEGORY_RESET } from "../../../constants/categoryConstants";
import { createCategory, clearErrors } from "../../../actions/categoryAction";

const NewCategory = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);

  const { loading, error, success } = useSelector((state) => state.newCategory);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Category Created Successfully");
      navigate("/admin/categories");
      dispatch({ type: NEW_CATEGORY_RESET });
    }
  }, [dispatch, error, alert, success, navigate]);

  const submitForm = (e) => {
    e.preventDefault();
    const myForm= {
      name, image: images[0]
    }
    dispatch(createCategory(myForm));
  };

  const createCategoryImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(() => [reader.result]);
          setImages(() => [reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="New Category" />
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
          <h5 className="card-header text-center">CREATE CATEGORY</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="name"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>
              </div>
              <div id="createProductFormFile" className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="category_image"
                  accept="image/*"
                  required
                  onChange={createCategoryImageChange}
                />
                <label className="input-group-text">Upload</label>
              </div>

              <div className="input-group mb-3 d-flex flex-row text-center">
                {imagePreview.map((image, index) => (
                  <img
                    style={{ height: 100, width: 100, marginRight: 16 }}
                    key={index}
                    src={image}
                    alt="Category"
                  />
                ))}
              </div>

              <input
                id="createCategoryBtn"
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

export default NewCategory;
