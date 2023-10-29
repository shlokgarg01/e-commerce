const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: "String",
      required: [true, "Please enter the Address Label."],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    pincode: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      validate: {
        validator: function (number) {
          var regex = /^[1-9][0-9]{9}$/g;
          return !number || regex.test(number);
        },
        message: "Provided Contact Number is invalid.",
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Address", addressSchema);
