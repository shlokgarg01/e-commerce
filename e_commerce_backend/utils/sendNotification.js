const nodemailer = require("nodemailer");
const axios = require('axios')

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendSMS = async (options) => {
  const config = process.env;
  let url = `http://sms.messageindia.in/v2/sendSMS?username=${config.SMS_USERNAME}&message=Your OTP For Authentication On The PARCHUN KING App Is ${options.otp} PRCUNK&sendername=${config.OTP_SMS_SENDERNAME}&smstype=${config.SMS_SMSTYPE}&numbers=${options.contactNumber}&apikey=${config.SMS_APIKEY}`;

  await axios.get(url)
  return null;
};

exports.sendOrderCreateSMS = async () => {
  const config = process.env;
  let url = `http://sms.messageindia.in/v2/sendSMS?username=${config.SMS_USERNAME}&message=New Order Received Successfully PRCUNK&sendername=${config.ORDER_SMS_SENDERNAME}&smstype=${config.SMS_SMSTYPE}&numbers=${config.ADMIN_CONTACT}&apikey=${config.SMS_APIKEY}`
  console.log("ADMIN CONTACT BEFORE", url)
  const x = await axios.get(url)
  console.log("----------------------------------------------", x)
  return null;
};