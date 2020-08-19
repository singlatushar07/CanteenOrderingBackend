const { func } = require("joi");

module.exports = function () {
  return Math.floor(1000 + Math.random() * 9000);
};
