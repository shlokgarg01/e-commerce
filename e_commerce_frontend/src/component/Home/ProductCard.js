import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // const options = {
  //   value: product.ratings,
  //   readOnly: true,
  //   precision: 0.5,
  // };

  return (
    <div className="shadow-lg card" style={{ width: "18rem", margin: 4 }}>
      <img src={product.images[0].url} alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <footer className="card-text">
          {`₹${product.price}`} ({product.numOfReviews} Reviews)
        </footer>
        <Link
          className="btn btn-outline-primary"
          to={`/product/${product._id}`}
        >
          Show
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
