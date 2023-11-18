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
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  console.log(options)

  // var url = 'https://api.textlocal.in/send/?apikey=MzY2Zjc0NGQzODY5Mzk1NTUxNjg3OTQ5NzIzMDdhNWE&numbers=918307747802&sender=TXTLCL&message=' + encodeURIComponent('OTP to login to parchun king ---- is 123456');
  // axios
  //   .get(url)
  //   .then(function (response) {
  //     console.log('Message sent -', response.data);
  //   })
  //   .catch(function (error) {
  //     console.log('Message not sent - ', error);
  //   });


  // client.messages
  //   .create({
  //     body: `Your OTP for Parchun King authentication is ${options.otp}`,
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: `+91${options.contactNumber}`,
  //   })
  //   .then((message) => console.log("OTP Sent - ", message.sid))
  //   .catch((error) => console.log("Error while sending OTP - ", error));
  return null;
};

exports.sendOrderCreateSMS = async () => {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  const contactNumber = process.env.ADMIN_CONTACT

  // client.messages
  //   .create({
  //     body: `New Order received.`,
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: `+91${contactNumber}`,
  //   })
  //   .then((message) => console.log("OTP Sent - ", message.sid))
  //   .catch((error) => console.log("Error while sending OTP - ", error));
  return null;
};