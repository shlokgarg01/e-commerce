const express = require("express");
const {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getTrendingProducts,
  getFavouriteProducts,
  getAdminProducts,
  getMostOrderedProducts,
  getCategoryProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/trending").get(getTrendingProducts);
router.route("/products/favourite").get(getFavouriteProducts);
router.route("/products/mostOrdered").get(getMostOrderedProducts)
router.route("/product/:id").get(getProductDetails);
router.route("/product/category/:id").get(getCategoryProducts)
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;
