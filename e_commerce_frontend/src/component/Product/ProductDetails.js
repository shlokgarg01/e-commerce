import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id]);
  return <div>ProductDetails</div>;
};

export default ProductDetails;
