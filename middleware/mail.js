require("dotenv").config();

const nodemailer = require("nodemailer");
const { getMaxListeners } = require("npm");

module.exports = function (name, otp, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "canteenorderingapp",
      pass: "sirsaharyana", // TODO: your gmail password
    },
  });

  let mailOptions = {
    from: "Canteen Ordering IITK", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "OTP for Canteen Ordering App registration",
    text: `Hi ${name},\n\nYour OTP for registering to the Canteen Ordering App is ${otp}.\n\nHappy eating! Team COA.`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs", err);
    }
    return console.log("Email sent!!!");
  });
};

var myVar;

function myFunction() {
  myVar = setTimeout(function () {
    console.log("Hello");
  }, 5000);
}

function myStopFunction() {
  clearTimeout(myVar);
}
myFunction();
myStopFunction();
