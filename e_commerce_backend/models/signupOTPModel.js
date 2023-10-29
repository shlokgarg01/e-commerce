const mongoose = require("mongoose");
const Enums = require('../utils/enums');

const signupOTPSchema = new mongoose.Schema({
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
  otpHash: {
    type: String,
    required: true
  },
  event: {
    type: String,
    enum: [Enums.OTP.REGISTRATION, Enums.OTP.AUTHENTICATION]
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});

module.exports = mongoose.model("SignupOTP", signupOTPSchema);
