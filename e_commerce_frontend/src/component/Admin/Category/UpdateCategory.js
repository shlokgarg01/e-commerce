import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  clearErrors,
  getCategoryDetails,
  updateCategory,
} from "../../../actions/categoryAction";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_CATEGORY_RESET } from "../../../constants/categoryConstants";

const UpdateCategory = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const params = useParams();

  const [name, setName] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.category);
  const { category, error } = useSelector((state) => state.categoryDetails);
  const categoryId = params.id;

  useEffect(() => {
    if (category && category._id !== categoryId) {
      dispatch(getCategoryDetails(categoryId));
    } else {
      setName(category.name);
      setOldImages([category.image]);
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
      alert.success("Category Updated Successfully");
      navigate("/admin/categories");
      dispatch({ type: UPDATE_CATEGORY_RESET });
    }

    dispatch(getAllCategories());
  }, [dispatch, error, alert, isUpdated, category, categoryId, updateError, navigate]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);

    images.forEach((image) => {
      myForm.append("image", image);
    });
    dispatch(updateCategory(categoryId, myForm));
  };

  const updateCategoryImageHandler = (e) => {
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

  return (
    <Fragment>
      <MetaData title="Update Category" />
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
          <h5 className="card-header text-center">UPDATE CATEGORY</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="mb-3">
              <label className="form-label">Category Name</label>
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
              <div className="mb-3">
              <label className="form-label">Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="Category Image"
                  accept="image/*"
                  required
                  onChange={updateCategoryImageHandler}
                />
              </div>

              <div className="input-group mb-3 d-flex flex-row text-center">
                {oldImages &&
                  oldImages.map((image, index) => (
                    <img
                      style={{ height: 100, width: 100, marginRight: 16 }}
                      key={index}
                      src={image.url}
                      alt="Current Category"
                    />
                  ))}
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
                disabled={loading ? true : false}
                id="updateCategoryBtn"
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

export default UpdateCategory;
