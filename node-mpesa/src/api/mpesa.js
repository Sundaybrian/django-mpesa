const express = require("express");
const router = express.Router();
const request = require("request");

// obtain mpesa access token middleware
const access_token = (req, res, next) => {
  const consumer_key = process.env["CONSUMER_KEY"];
  const consumer_secret = process.env["CONSUMER_SECRET"];
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth,
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
        res.status(500).json(error);
      } else {
        console.log(body);
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
};

router.get("/", (req, res) => {
  res.json(["😀", "😳", "🙄"]);
});

router.get("/access-token", access_token, (req, res) => {
  res.json({ token: req.access_token });
});

module.exports = router;
