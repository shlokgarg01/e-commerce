const SubCategory = require('../models/subCategoryModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");

// create sub category -- Admin
exports.createSubCategory = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  let image = {};
  const result = await cloudinary.v2.uploader.upload_large(req.body.image, {
    folder: "subcategories",
  });

  image.public_id = result.public_id;
  image.url = result.secure_url;
  req.body.image = image;

  const subcategory = await SubCategory.create(req.body);
  res.status(200).json({
    success: true,
    subcategory,
  });
});

// get all sub categories
exports.getAllSubCategories = catchAsyncErrors(async (req, res) => {
  const subcategories = await SubCategory.find().populate("category")

  return res.status(200).json({
    success: true,
    subcategories,
    subcategoriesCount: subcategories.length
  });
});

// get all sub categories of a category
exports.getAllSubCategoriesofCategory = catchAsyncErrors(async (req, res) => {
  const subcategories = await SubCategory.find({ category: req.params.categoryId }).populate("category")

  return res.status(200).json({
    success: true,
    subcategories,
    subcategoriesCount: subcategories.length
  });
});

// update a sub category -- Admin
exports.updateSubCategory = catchAsyncErrors(async (req, res, next) => {
  let subcategory = await SubCategory.findById(req.params.id);
  if (!subcategory) {
    return next(new ErrorHandler("Sub Category Not Found.", 404));
  }

  let image = req.body.image;
  if (image !== undefined) {
    if (subcategory.image?.public_id)
      await cloudinary.v2.uploader.destroy(subcategory.image.public_id);

    const imagesLink = {};
    const result = await cloudinary.v2.uploader.upload_large(image, {
      folder: "subcategories",
    });

    imagesLink.public_id = result.public_id;
    imagesLink.url = result.secure_url;

    req.body.image = imagesLink;
  }

  subcategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    subcategory,
  });
});

// get sub category details
exports.getSubCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await SubCategory.findById(req.params.id).populate("category");

  if (!subcategory) {
    return next(new ErrorHandler("Sub Category Not Found", 404));
  }

  res.status(200).json({
    success: true,
    subcategory,
  });
});

// delete sub category -- Admin
exports.deleteSubCategory = catchAsyncErrors(async (req, res, next) => {
  const subcategory = await SubCategory.findById(req.params.id);

  if (!subcategory) {
    return next(new ErrorHandler("Sub Category Not Found", 404));
  }

  if (subcategory.image?.public_id)
    await cloudinary.v2.uploader.destroy(subcategory.image?.public_id);

  await subcategory.deleteOne();
  res.status(200).json({
    success: true,
    message: "SubCategory deleted successfully",
  });
});
