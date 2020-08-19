const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  //401 unauthorized
  //403 forbidden

  if (!req.user.isAdmin) return res.status(403).send("Access Denied.");
  next();
};
