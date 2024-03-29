const fetch = require("node-fetch");

async function sendNotification(token, title, message) {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "post",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: title,
      body: message,
    }),
  });

  const data = await response;
}

module.exports = sendNotification;
