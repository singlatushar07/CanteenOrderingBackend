require("dotenv").config();

const nodemailer = require("nodemailer");
const { getMaxListeners } = require("npm");

module.exports = function (name, otp, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "canteenorderingapp",
      pass: "sirsaharyana",
    },
  });

  let mailOptions = {
    from: "Canteen Ordering IITK",
    to: email,
    subject: "OTP for Canteen Ordering App registration",
    text: `Hi ${name},\n\nYour OTP for registering to the Canteen Ordering App is ${otp}.\n\nHappy eating! Team COA.`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error Occured while sendimg email.", err);
    }
    return console.log("Email sent!!!");
  });
};
