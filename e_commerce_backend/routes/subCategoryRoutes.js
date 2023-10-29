const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  getSubCategoryDetails,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategoriesofCategory,
  getAllSubCategories,
} = require("../controllers/subCategoryController");
const router = express.Router();

router.route("/subcategories/:categoryId").get(getAllSubCategoriesofCategory);
router.route("/admin/subcategories").get(getAllSubCategories)
router
  .route("/admin/subcategory/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createSubCategory);
router
  .route("/admin/subcategory/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateSubCategory)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteSubCategory)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSubCategoryDetails);

module.exports = router;
