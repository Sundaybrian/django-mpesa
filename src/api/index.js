const express = require("express");

const mpesa = require("./mpesa");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/payments", mpesa);

module.exports = router;
