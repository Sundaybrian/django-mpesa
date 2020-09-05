const express = require("express");
const router = express.Router();
const request = require("request");
const app = require("../app");

const format_time = () => {
  // returns formatted timestamp that safaricom accepts
  const date = new Date().toISOString().substr(0, 19);
  const formatted_time = date.replace(/[-:-T]/g, "");
  console.log(formatted_time);

  return formatted_time;
};

const generate_password = (formatted_time) => {
  // generate password for safaricom
  const decoded_password = new Buffer.from(
    process.env["LIPA_NA_MPESA_SHORTCODE"] +
      process.env["LIPA_NA_MPESA_PASSKEY"] +
      formatted_time
  ).toString("base64");

  return decoded_password;
};

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

// stkpush
router.get("/stk", access_token, (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth = "Bearer " + req.access_token;
  const formatted_time = format_time();

  request(
    {
      url,
      method: "POST",
      headers: { Authorization: auth },
      json: {
        BusinessShortCode: process.env["LIPA_NA_MPESA_SHORTCODE"],
        Password: generate_password(formatted_time),
        Timestamp: formatted_time,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: process.env["PHONE_NUMBER"],
        PartyB: process.env["LIPA_NA_MPESA_SHORTCODE"],
        PhoneNumber: process.env["PHONE_NUMBER"],
        CallBackURL: process.env["CALLBACK_URL"],
        AccountReference: "123456780",
        TransactionDesc: "buymilk",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

//lnm callback url
// app.post("/stk_callback", (req, res) => {});

router.get("/access-token", access_token, (req, res) => {
  res.json({ token: req.access_token });
});

module.exports = router;
