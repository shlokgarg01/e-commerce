const crypto = require("crypto");
const { sendSMS } = require("./sendNotification");

exports.generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

exports.otpHash = (otp) =>
  String(crypto.createHash("sha256").update(otp).digest("hex"));

exports.sendOTP = (otp, contactNumber) => {
  sendSMS({ otp, contactNumber });
};
