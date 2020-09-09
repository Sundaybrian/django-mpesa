const { oAuth } = require("../payments");

module.exports = async (req, res, next) => {
  try {
    const credentials = await oAuth();
    req.access_token = credentials.data["access_token"];
    next();
  } catch (error) {
    next(error);
  }
};
