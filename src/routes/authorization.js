const express = require("express");
const { verificaToken } = require("../middlewares/rest");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Wiki home page");
});

router.get("/about", verificaToken, function (req, res) {
  res.send("About this wiki");
});

module.exports = router;