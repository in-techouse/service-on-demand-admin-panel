var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  // if (req.session.isAdmin && req.session.isAdmin === true) {
    res.render("pages/admin/index");
  // } else {
    // res.redirect("/");
  // }
});

module.exports = router;
