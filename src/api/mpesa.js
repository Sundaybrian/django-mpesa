const express = require("express");
const router = express.Router();

const AuthToken = require("../middleware/accessToken");
const { lipaNaMpesaOnline } = require("../payments");

// initializ stk push
router.post("/stk", AuthToken, async (req, res, next) => {
  try {
    console.log(req.access_token);
    const results = await lipaNaMpesaOnline(
      (shortCode = null),
      (passkey = null),
      (amount = null),
      (transactionType = "CustomerPayBillOnline"),
      (senderMsisdn = null),
      (callbackUrl = null),
      (accountRef = null),
      (transactionDesc = null),
      (token = req.access_token)
    );
    res.status(200).json(results.data);
  } catch (error) {
    console.log(error.response.data);
    next(error);
  }
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
  console.log(req.body);
  res.json("hello");
});

router.get("/access-token", AuthToken, (req, res) => {
  res.json({ token: req.access_token });
});

module.exports = router;
