const { oAuth } = require("../mpesa");

const acces_token = async (req, res, next) => {
  try {
    const credentials = await oAuth();
    req.access_token = credentials.data["access_token"];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  acces_token,
};
