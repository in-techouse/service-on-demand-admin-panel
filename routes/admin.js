var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/index");
});

module.exports = router;
