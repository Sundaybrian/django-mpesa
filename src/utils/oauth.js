const axios = require("axios");
module.exports = function (consumerKey, consumerSecret, baseUrl) {
  const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString(
    "base64"
  );
  return axios.get(
    baseUrl + "/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: "Basic " + auth,
        "content-type": "application/json",
      },
    }
  );
};
