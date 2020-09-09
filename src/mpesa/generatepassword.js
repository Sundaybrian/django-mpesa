const generate_password = (formatted_time) => {
  // generate password for safaricom
  const decoded_password = new Buffer.from(
    process.env["LIPA_NA_MPESA_SHORTCODE"] +
      process.env["LIPA_NA_MPESA_PASSKEY"] +
      formatted_time
  ).toString("base64");

  return decoded_password;
};
