const axios = require("axios");

module.exports = function (
  consumerKey = null,
  consumerSecret = null,
) {
  let auth = Buffer.from(
    process.env["CONSUMER_KEY"] + ":" + process.env["CONSUMER_SECRET"]
  ).toString("base64");

  return axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: 'Basic ' + auth,
        'content-type': 'application/json',
      },
    }
  );
};
