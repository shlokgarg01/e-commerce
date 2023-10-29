const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  myAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressDetails,
} = require("../controllers/addressController");
const router = express.Router();

router.route("/address/new").post(isAuthenticatedUser, createAddress);
router
.route("/address/:id")
.put(isAuthenticatedUser, updateAddress)
.delete(isAuthenticatedUser, deleteAddress);
router.route("/address/me").get(isAuthenticatedUser, myAddresses);
router.route("/address/:id").get(isAuthenticatedUser, getAddressDetails);

module.exports = router;
