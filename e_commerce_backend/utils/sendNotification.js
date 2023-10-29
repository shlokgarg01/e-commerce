const nodemailer = require("nodemailer");

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

  client.messages
    .create({
      body: `Your OTP for Parchun King authentication is ${options.otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${options.contactNumber}`,
    })
    .then((message) => console.log("OTP Sent - ", message.sid))
    .catch((error) => console.log("Error while sending OTP - ", error));
  return null;
};
