const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const SignupOTP = require("../models/signupOTPModel");
const sendToken = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendNotification");
const crypto = require("crypto");
const { generateOTP, otpHash, sendOTP } = require("../utils/otp");
const Enums = require("../utils/enums");
const cloudinary = require('cloudinary')

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, contactNumber } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    contactNumber,
  });
  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); // select password is needed bcz we have specified select: false on password in the model
  if (!user) {
    return next(new ErrorHandler("No user with this email.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // get resetPasswordToken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\nIf you haven't requested this email, then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password recovery`,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Passwordtoken is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords don't match.", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords don't match.", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// get user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
  };

  // TODO - add cloudinary for avatar update
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user details -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// delete user profile -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404)
    );
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// send OTP for registration
exports.sendOTPForRegistration = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber } = req.body;
  const user = await User.findOne({ contactNumber });
  if (user) {
    return next(
      new ErrorHandler(
        "User with this Contact Number already exists. Please login.",
        400
      )
    );
  }

  const otp = generateOTP();
  sendOTP(otp, contactNumber);
  let hash = otpHash(otp);

  await SignupOTP.create({
    contactNumber,
    otpHash: hash,
    event: Enums.OTP.REGISTRATION,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// autheticate the OTP for registration
exports.authenticateUserViaOTPForRegistration = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber, otp } = req.body;
  let hash = otpHash(otp);

  const queriedOTPs = await SignupOTP.find({ contactNumber });
  let queriedOTP = null;
  for (let i = 0; i < queriedOTPs.length; i++) {
    if (queriedOTPs[i]["otpHash"] === hash) {
      queriedOTP = queriedOTPs[i];
      break;
    }
  }

  if (!queriedOTP) {
    return next(new ErrorHandler("Incorrect OTP. Please try again.", 400));
  }

  queriedOTP.event = Enums.OTP.AUTHENTICATION;
  await queriedOTP.save();

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

// register user via OTP
exports.registerUserViaOTP = catchAsyncErrors(async (req, res, next) => {
  const { name, email, contactNumber, otp } = req.body;
  let hash = otpHash(otp);

  const queriedOTPs = await SignupOTP.findOne({
    contactNumber,
    otpHash: hash,
    event: Enums.OTP.AUTHENTICATION,
  });
  if (!queriedOTPs) {
    return next(
      new ErrorHandler("Could not match the OTP. Please try again.", 400)
    );
  }
  
  const user = await User.create({
    name,
    email,
    contactNumber,
    // avatar: {
      //   public_id: "This is a sample id",
      //   url: "This is a sample url",
      // },
    });
  await SignupOTP.deleteMany({ contactNumber });
  sendToken(user, 201, res);
});

// send OTP for Login
exports.sendOTPForLogin = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber } = req.body;
  const user = await User.findOne({ contactNumber });
  if (!user) {
    return next(
      new ErrorHandler(
        "User with this Contact Number does not exist. Please Register.",
        400
      )
    );
  }

  const otp = generateOTP();
  sendOTP(otp, contactNumber);
  let hash = otpHash(otp);

  await SignupOTP.create({
    contactNumber,
    otpHash: hash,
    event: Enums.OTP.AUTHENTICATION,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// autheticate the OTP for Login
exports.authenticateUserViaOTPForLogin = catchAsyncErrors(async (req, res, next) => {
  const { contactNumber, otp } = req.body;
  let hash = otpHash(otp);

  const queriedOTPs = await SignupOTP.find({ contactNumber });
  let queriedOTP = null;
  for (let i = 0; i < queriedOTPs.length; i++) {
    if (queriedOTPs[i]["otpHash"] === hash) {
      queriedOTP = queriedOTPs[i];
      break;
    }
  }

  if (!queriedOTP) {
    return next(new ErrorHandler("Incorrect OTP. Please try again.", 400));
  }

  const user = await User.findOne({ contactNumber });
  if(!user) {
    return next(new ErrorHandler("OTP verified, but no user found for the given Contact Number.", 400))
  }

  await SignupOTP.deleteMany({ contactNumber });
  sendToken(user, 201, res);
});
