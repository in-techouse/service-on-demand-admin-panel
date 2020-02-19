var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/index", { action: "dashboard" });
});

router.get("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/createVendor", { action: "createVendor" });
});

router.post("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/createVendor", { action: "createVendor" });
});

router.get("/allVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allVendor", { action: "allVendor" });
});

router.get("/allUser", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allUser", { action: "allUser" });
});

router.get("/allBooking", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allBooking", { action: "allBooking" });
});

router.get("/complains", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/complains", { action: "complains" });
});

module.exports = router;
