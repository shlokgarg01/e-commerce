const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLink = [];
  for (let i = 0; i < images.length; ++i) {
    const result = await cloudinary.v2.uploader.upload_large(images[i], {
      folder: "products",
    });

    imagesLink.push({
      public_id: result?.public_id,
      url: result?.secure_url,
    });
  }

  req.body.images = imagesLink;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 5;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // .pagination(resultsPerPage);
  const products = await apiFeature.query;

  return res.status(200).json({
    success: true,
    products,
    productsCount,
    resultsPerPage,
  });
});

// get all products -- Admin
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find().populate("subCategory");

  return res.status(200).json({
    success: true,
    products,
  });
});

// get trending products
exports.getTrendingProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ trending: true });

  return res.status(200).json({
    success: true,
    products,
    productsCount: products.length,
  });
});

// get favourite products
exports.getFavouriteProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ favourite: true });

  return res.status(200).json({
    success: true,
    products,
    productsCount: products.length,
  });
});

// get most ordered products
exports.getMostOrderedProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({}).sort({ count: -1 });

  return res.status(200).json({
    success: true,
    products,
    productsCount: products.length,
  });
});

// update a product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Deleting existing images from cloudinary & adding new images (if any)
  if (req.body.images.length > 0) {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // delete images from Cloudinary
      for (let i = 0; i < product.images.length; ++i) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      // Uploading new images
      const imagesLink = [];
      for (let i = 0; i < images.length; ++i) {
        const result = await cloudinary.v2.uploader.upload_large(images[i], {
          folder: "products",
        });

        imagesLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesLink;
    }
  } else {
    req.body.images = product.images
  }

  product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("subCategory");

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// get products of a category
exports.getCategoryProducts = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category Not Found", 404));
  }

  const products = await Product.find({ category: category.name });
  if (!products) {
    return next(new ErrorHandler("Products Not Found", 404));
  }

  let subCategoryProducts = await Product.aggregate([
    { $match: { category: category.name } }, // Filter by desired category
    { $group: { _id: "$subCategory", products: { $push: "$$ROOT" } } }, // Group by subcategory
  ]).exec();

  // change _id to category name in the result
  subCategoryProducts = subCategoryProducts.map(async ({ _id, products }) => {
    let subCategory = await SubCategory.findById(_id);
    return {
      subCategory: subCategory?.name,
      subCategoryImage: subCategory?.image,
      products,
    };
  });

  const results = await Promise.all(subCategoryProducts);
  res.status(200).json({
    success: true,
    products: results,
  });
});

// delete product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // delete images from Cloudinary
  for (let i = 0; i < product.images.length; ++i) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// create a new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewd = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewd) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avgRating = 0;
  product.reviews.forEach((rev) => {
    avgRating += rev.rating;
  });

  product.ratings = avgRating / product.reviews.length;

  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "Product rating added successfully",
  });
});

// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found.", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete a review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found.", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avgRating = 0;
  reviews.forEach((rev) => {
    avgRating += rev.rating;
  });

  let ratings = 0;
  if (reviews.length > 0) {
    ratings = avgRating / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review Deleted successfully",
  });
});

// get suggested products
exports.getSuggestedProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({}).limit(15);

  return res.status(200).json({
    success: true,
    products,
    productsCount: products.length,
  });
});
