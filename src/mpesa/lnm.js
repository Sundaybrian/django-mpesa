const axios = require("axios");

module.exports = async function (
  shortCode = null,
  passkey = null,
  password,
  amount,
  transactionType = "CustomerPayBillOnline",
  senderMsisdn,
  callbackUrl = null,
  accountRef,
  transactionDesc
) {
  const formatted_time = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  return req.post("mpesa/stkpush/v1/processrequest", {
    BusinessShortCode: process.env["LIPA_NA_MPESA_SHORTCODE"],
    Password: password,
    Timestamp: formatted_time,
    TransactionType: transactionType,
    Amount: amount || "1",
    PartyA: senderMsisdn || process.env["PHONE_NUMBER"],
    PartyB: process.env["LIPA_NA_MPESA_SHORTCODE"],
    PhoneNumber: senderMsisdn || process.env["PHONE_NUMBER"],
    CallBackURL: process.env["CALLBACK_URL"],
    AccountReference: accountRef || "123456780",
    TransactionDesc: transactionDesc || "buymilk",
  });
};
