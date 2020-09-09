const axios = require("axios");

module.exports = async function (
  shortCode = null,
  passkey = null,
  amount,
  transactionType = "CustomerPayBillOnline",
  senderMsisdn,
  callbackUrl = null,
  accountRef,
  transactionDesc,
  token
) {
  const formatted_time = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  const decoded_password = new Buffer.from(
    process.env["LIPA_NA_MPESA_SHORTCODE"] +
      process.env["LIPA_NA_MPESA_PASSKEY"] +
      formatted_time
  ).toString("base64");

  console.log(token, "==============");
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: process.env["LIPA_NA_MPESA_SHORTCODE"],
      Password: decoded_password,
      Timestamp: formatted_time,
      TransactionType: transactionType,
      Amount: amount || "1",
      PartyA: senderMsisdn || process.env["PHONE_NUMBER"],
      PartyB: process.env["LIPA_NA_MPESA_SHORTCODE"],
      PhoneNumber: senderMsisdn || process.env["PHONE_NUMBER"],
      CallBackURL: process.env["CALLBACK_URL"],
      AccountReference: accountRef || "123456780",
      TransactionDesc: transactionDesc || "buymilk",
    },
    config
  );
};
