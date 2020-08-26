const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(400).send("No token provided");

  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, "nikhil");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
};
