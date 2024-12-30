const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { createConstant, updateBanners, getAllBanners } = require("../controllers/constantsController");
const router = express.Router();

router.route("/constants/new").post(isAuthenticatedUser, createConstant);
router.route("/constants/update/banners").post(isAuthenticatedUser, updateBanners);
router.route("/constants/banners").get(isAuthenticatedUser, getAllBanners);

module.exports = router;