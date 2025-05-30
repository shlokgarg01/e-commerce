const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  registerUserViaOTP,
  sendOTPForRegistration,
  sendOTPForLogin,
  authenticateUserViaOTPForRegistration,
  authenticateUserViaOTPForLogin,
  deleteUserAccount,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);


router.route("/register/otp/send").post(sendOTPForRegistration);
router
  .route("/register/otp/verify")
  .post(authenticateUserViaOTPForRegistration);
router.route("/register/otp").post(registerUserViaOTP);
router.route("/login/otp/send").post(sendOTPForLogin);
router.route("/login/otp/verify").post(authenticateUserViaOTPForLogin);


router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/user/delete").post(isAuthenticatedUser, deleteUserAccount)

module.exports = router;
