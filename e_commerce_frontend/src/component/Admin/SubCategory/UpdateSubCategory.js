import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../actions/categoryAction";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSubCategoryDetails,
  updateSubCategory,
  clearErrors,
} from "../../../actions/subCategoryAction";
import { UPDATE_SUB_CATEGORY_RESET } from "../../../constants/subCategoryConstants";

const UpdateSubCategory = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const params = useParams();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  // const [oldImages, setOldImages] = useState([]);
  // const [images, setImages] = useState([]);
  // const [imagePreview, setImagesPreview] = useState([]);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.subCategory);
  const { subCategory, error } = useSelector(
    (state) => state.subCategoryDetails
  );
  const { categories } = useSelector((state) => state.categories);
  const subCategoryId = params.id;

  useEffect(() => {
    if (subCategory && subCategory._id !== subCategoryId) {
      dispatch(getSubCategoryDetails(subCategoryId));
    } else {
      setName(subCategory.name);
      setCategory(subCategory.category._id);
      // setOldImages([subCategory.image]);
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
      alert.success("Sub Category Updated Successfully");
      navigate("/admin/subcategories");
      dispatch({ type: UPDATE_SUB_CATEGORY_RESET });
    }

    dispatch(getAllCategories());
  }, [
    dispatch,
    error,
    alert,
    isUpdated,
    subCategory,
    subCategoryId,
    updateError,
    navigate,
  ]);

  const submitForm = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("category", category);

    // images.forEach((image) => {
    //   myForm.append("image", image);
    // });
    dispatch(updateSubCategory(subCategoryId, myForm));
  };

  // const updateSubCategoryImageHandler = (e) => {
  //   const files = Array.from(e.target.files);

  //   setImages([]);
  //   setImagesPreview([]);
  //   setOldImages([]);

  //   files.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setImagesPreview((old) => [...old, reader.result]);
  //         setImages((old) => [...old, reader.result]);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

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
          <h5 className="card-header text-center">UPDATE SUB CATEGORY</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="mb-3">
                <label className="form-label">Sub Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sub Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="name"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select form-select"
                >
                  <option value="">Choose Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="mb-3">
                <label className="form-label">Sub Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="Category Image"
                  accept="image/*"
                  onChange={updateSubCategoryImageHandler}
                />
              </div> */}

              {/* <div className="input-group mb-3 d-flex flex-row text-center">
                {oldImages &&
                  oldImages.map((image, index) => (
                    <img
                      style={{ height: 100, width: 100, marginRight: 16 }}
                      key={index}
                      src={image.url}
                      alt="Current Category"
                    />
                  ))}
              </div> */}

              {/* <div className="input-group mb-3 d-flex flex-row text-center">
                {imagePreview.map((image, index) => (
                  <img
                    style={{ height: 100, width: 100, marginRight: 16 }}
                    key={index}
                    src={image}
                    alt="Category"
                  />
                ))}
              </div> */}

              <input
                disabled={loading ? true : false}
                id="updateSubCategoryBtn"
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

export default UpdateSubCategory;
