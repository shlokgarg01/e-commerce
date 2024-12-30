const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require('cloudinary')

// create category -- Admin
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  let image = {};
  const result = await cloudinary.v2.uploader.upload_large(req.body.image, {
    folder: "categories",
  });

  image.public_id = result.public_id;
  image.url = result.secure_url;
  req.body.image = image;

  const category = await Category.create(req.body);
  res.status(200).json({
    success: true,
    category,
  });
});

// get all categories
exports.getAllCategories = catchAsyncErrors(async (req, res) => {
  const categoryCount = await Category.countDocuments();
  const categories = await Category.find().sort({"order": 1});

  return res.status(200).json({
    success: true,
    categories,
    categoryCount,
  });
});

// update a category -- Admin
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category Not Found.", 404));
  }

  let image = req.body.image;
  if (image !== undefined) {
    await cloudinary.v2.uploader.destroy(category.image.public_id);

    const imagesLink = {};
    const result = await cloudinary.v2.uploader.upload_large(image, {
      folder: "categories",
    });

    imagesLink.public_id = result.public_id;
    imagesLink.url = result.secure_url;

    req.body.image = imagesLink;
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    category,
  });
});

// get category details
exports.getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category Not Found", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// delete category -- Admin
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category Not Found", 404));
  }

  await cloudinary.v2.uploader.destroy(category.image.public_id);

  await category.deleteOne();
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
