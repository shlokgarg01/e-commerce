const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const enums = require("../utils/enums");
const { sendOrderCreateSMS } = require("../utils/sendNotification");

// Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingAddress,
    orderItems,
    paymentInfo,
    coupon,
    couponDiscount,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
  } = req.body;

  // update ordersCount on the Product
  req.body.orderItems.forEach(async (orderItem) => {
    const product = await Product.findById(orderItem.product);

    product.ordersCount += 1;
    product.save();
  });

  const order = await Order.create({
    shippingAddress,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    coupon,
    couponDiscount,
    orderStatus,
    paidAt: Date.now(),
    user: req.user._id,
  });

  sendOrderCreateSMS();

  res.status(201).json({
    success: true,
    order,
  });
});

// get single order / get order details
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("shippingAddress");

  if (!order) {
    return next(new ErrorHandler("Order not found with the given Id.", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// My Orders for a logged in user
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    orderStatus: { $ne: enums.ORDER_STATUS.PLACED },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    orderStatus: { $ne: enums.ORDER_STATUS.PLACED },
  });

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with the given Id.", 404));
  }

  if (order.orderStatus === enums.ORDER_STATUS.DELIVERED) {
    return next(
      new ErrorHandler("You have already delivered this order.", 404)
    );
  }

  if (req.body.status === enums.ORDER_STATUS.DISPATCHED) {
    order.orderItems.forEach(async (orderItem) => {
      await updateStock(orderItem.product, orderItem.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === enums.ORDER_STATUS.DELIVERED) {
    order.deliveredAt = Date.now();
    if (order.paymentInfo.status === enums.PAYMENT_STATUS.FAILED) {
      order.paymentInfo.status = enums.PAYMENT_STATUS.SUCCEEDED;
    }
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with the given Id.", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});

// Check Payment Status
exports.checkPaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const merchantTransactionId = req.params.txnId;
  const merchantId = process.env.PHONEPE_MERCHENT_ID;
  const keyIndex = process.env.PHONEPE_KEY_INDEX;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  // prod url - https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}
  // stag url - https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}
  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-CLIENT-ID": `${merchantId}`,
    },
  };
  // CHECK PAYMENT STATUS
  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        console.log(response.data);

        // updating order status in case payment in success.
        await Order.findOneAndUpdate(
          { "paymentInfo.transactionId": merchantTransactionId },
          {
            orderStatus: enums.ORDER_STATUS.RECEIVED,
            "paymentInfo.paymentInstrument":
              response.data.data.paymentInstrument,
          },
          { new: true }
        );

        return res
          .status(200)
          .send({ success: true, message: "Payment Success" });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Payment Failure" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ msg: err.message });
    });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;
  await product.save();
}
