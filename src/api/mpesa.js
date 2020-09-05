const express = require("express");
const router = express.Router();
const request = require("request");

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
        next(error);
      } else {
        const resp = JSON.parse(body);
        req.access_token = resp["access_token"];
        next();
      }
    }
  );
};

// stkpush
router.get("/stk", access_token, (req, res, next) => {
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
        next(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

//lnm callback url
router.post("/stk_callback", (req, res) => {
  /**
   * merchant_request_id = request.data["Body"]["stkCallback"]["MerchantRequestID"]
        checkout_request_id = request.data["Body"]["stkCallback"]["CheckoutRequestID"]
        result_code = request.data["Body"]["stkCallback"]["ResultCode"]
        result_desc = request.data["Body"]["stkCallback"]["ResultDesc"]
        amount = request.data["Body"]["stkCallback"]["CallbackMetadata"]["Item"][0][
            "Value"
        ]
        mpesa_receipt_number = request.data["Body"]["stkCallback"]["CallbackMetaData"][
            "Item"
        ][1]["Value"]
        transaction_date = request.data["Body"]["stkCallback"]["CallbackMetaData"][
            "Item"
        ][3]["Value"]
        phone_number = request.data["Body"]["stkCallback"]["CallbackMetaData"]["Item"][
            4
        ]["Value"]

        from datetime import datetime

        str_transaction_date = str(transaction_date)
        transaction_datetime = datetime.strptime(str_transaction_date, "%Y%m%d%H%M%S")

        transaction = LNMOnlineTransaction.objects.create(
            CheckoutRequestID=checkout_request_id,
            MerchantRequestID=merchant_request_id,
            ResultCode=result_code,
            ResultDesc=result_desc,
            Amount=amount,
            MpesaReceiptNumber=mpesa_receipt_number,
            TransactionDate=transaction_datetime,
            PhoneNumber=phone_number,
        )

        transaction.save()
   */
  console.log(req.data);
  res.json("hello");
});

router.get("/access-token", access_token, (req, res) => {
  res.json({ token: req.access_token });
});

module.exports = router;
