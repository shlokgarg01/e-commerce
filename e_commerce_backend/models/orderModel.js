const mongoose = require("mongoose");
const enums = require("../utils/enums");

const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    paidAt: {
      type: Date,
      required: true,
    },
    coupon: {
      type: String,
      default: "",
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    itemsPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      requierd: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: enums.ORDER_STATUS.RECEIVED,
    },
    deliveredAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);
