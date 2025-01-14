const Constants = require("../models/constantsModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const CONSTANTS = require("../config/constants");

// create Constant
exports.createConstant = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const constants = await Constants.create(req.body);
  if (!constants) {
    return next(
      new ErrorHandler("Cannot create constant. Please try later.", 400)
    );
  }

  res.status(200).json({
    success: true,
    constants,
  });
});

// get all banners
exports.getAllBanners = catchAsyncErrors(async (req, res, next) => {
  const banners = await Constants.findOne({
    name: CONSTANTS.CONSTANTS.BANNERS,
  });
  return res.status(200).json({
    success: true,
    banners: banners?.metadata?.banners || [],
  });
});

// add/update banners
exports.updateBanners = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  let banners = await Constants.findOne({ name: CONSTANTS.CONSTANTS.BANNERS });
  banners = banners?.metadata?.banners || [];

  let images = req.body.images;
  let imageLinks = [];
  for (let i = 0; i < images.length; ++i) {
    let image = images[i];

    if (typeof image === "string") {
      // deleting existing image from cloudinary
      await cloudinary.v2.uploader.destroy(banners[i].public_id);

      // uploading new image to cloudinary
      let result = await cloudinary.v2.uploader.upload_large(image, {
        folder: CONSTANTS.CLOUDINARY_FOLDERS.BANNERS,
      });
      imageLinks.push({ public_id: result.public_id, url: result.secure_url });
    } else {
      imageLinks.push(image);
    }
  }

  let constants = await Constants.findOneAndUpdate(
    { name: CONSTANTS.CONSTANTS.BANNERS },
    { metadata: { banners: imageLinks } },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    constants,
  });
});

// Get All Stats -- Admin
exports.getStats = catchAsyncErrors(async (req, res, next) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalUsers = await User.countDocuments();

  return res.status(200).json({
    success: true,
    totalCategories,
    totalOrders,
    totalProducts,
    totalUsers,
  });
});
