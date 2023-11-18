import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NEW_SUB_CATEGORY_RESET } from "../../../constants/subCategoryConstants";
import { createSubCategory, clearErrors } from '../../../actions/subCategoryAction'
import { getAllCategories } from "../../../actions/categoryAction";

const NewSubCategory = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagesPreview] = useState([]);

  const { loading, error, success } = useSelector((state) => state.newSubCategory);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Sub Category Created Successfully");
      navigate("/admin/subcategories");
      dispatch({ type: NEW_SUB_CATEGORY_RESET });
    }

    // dispatch(getSubCategoryDetails())
    dispatch(getAllCategories());
  }, [dispatch, error, alert, success, navigate]);

  const submitForm = (e) => {
    e.preventDefault();

    // const myForm = new FormData();
    // myForm.set("name", name);
    // myForm.set("category", category);

    // images.forEach((image) => {
    //   myForm.append("image", image);
    // });
    const myForm= {
      name, category, image: image[0]
    }
    dispatch(createSubCategory(myForm));
  };

  const createSubCategoryImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImage([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(() => [reader.result]);
          setImage(() => [reader.result]);
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
          <h5 className="card-header text-center">CREATE SUB CATEGORY</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="form-floating mb-3">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Sub Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="subCategoryName"
                    aria-describedby="basic-addon1"
                    required
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
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="sub_category_image"
                  accept="image/*"
                  required
                  onChange={createSubCategoryImageChange}
                />
                <label className="input-group-text">Upload</label>
              </div>

              <div className="input-group mb-3 d-flex flex-row text-center">
                {imagePreview.map((image, index) => (
                  <img
                    style={{ height: 100, width: 100, marginRight: 16 }}
                    key={index}
                    src={image}
                    alt="SubCategory"
                  />
                ))}
              </div>

              <input
                id="createSubCategoryBtn"
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

export default NewSubCategory