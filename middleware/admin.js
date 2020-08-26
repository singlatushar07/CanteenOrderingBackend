const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  //401 unauthorized
  //403 forbidden
  const token = req.header("x-auth-token");
  const decoded = jwt.decode(token);

  if (!decoded.isAdmin) return res.status(403).send("Access Denied.");

  next();
};
