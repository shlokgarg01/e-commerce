import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import "../Admin.css";
import {
  clearErrors,
  getAllBanners,
  updateBanners,
} from "../../../actions/constantsActions";
import Loader from "../../layout/Loader/Loader";
import { UPDATE_BANNERS_RESET } from "../../../constants/constantsConstants";

const Banners = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const { error, banners, loading } = useSelector((state) => state.banners);
  const { isUpdated, loading: updateLoading } = useSelector((state) => state.updateBanners)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Banners Updated Successfully");
      dispatch({ type: UPDATE_BANNERS_RESET });
    }

    dispatch(getAllBanners());
  }, [dispatch, error, alert, navigate, isUpdated]);

  const submitForm = (e) => {
    e.preventDefault();
    dispatch(updateBanners({ images }));
  };

  useEffect(() => {
    setImages(banners)
  }, [banners])

  const createCategoryImageChange = (e, index) => {
    const files = Array.from(e.target.files);

    // setImages([]);
    // setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          // setImagesPreview(() => [reader.result]);
          // setImages(() => [reader.result]);
          const updatedImages = images.map((item, idx) =>
            idx === index ? reader.result : item
          );
          setImages(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return loading || updateLoading ? (
    <Loader />
  ) : (
    <>
      <MetaData title="App Banners" />
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <div className="shadow card" style={{ width: "31rem" }}>
          <h5 className="card-header text-center">EDIT BANNERS</h5>
          <div className="card-body">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <div className="input-group mb-3 d-flex flex-row text-center">
                {images.map((image, index) => (
                  <span className="mb-3">
                    <img
                      style={{ height: 70, width: 70 }}
                      key={index}
                      src={typeof(image) === 'string' ? image : image.url}
                      alt={`Banner ${index}`}
                    />
                    <div
                      id="createProductFormFile"
                      className="input-group mb-3"
                    >
                      <input
                        type="file"
                        className="form-control"
                        name="category_image"
                        accept="image/*"
                        onChange={(e) => createCategoryImageChange(e, index)}
                      />
                      <label className="input-group-text">Upload</label>
                    </div>
                  </span>
                ))}
              </div>

              <input
                disabled={loading ? true : false}
                id="updateBannersBtn"
                type="submit"
                value="Update"
                className="btn btn-primary"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banners;
