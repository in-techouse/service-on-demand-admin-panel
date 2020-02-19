var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/index", { action: "dashboard", session: req.session });
});

router.get("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/createVendor", { action: "createVendor", session: req.session });
});

router.post("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/createVendor", { action: "createVendor", session: req.session });
});

router.get("/allVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allVendor", { action: "allVendor", session: req.session });
});

router.get("/allUser", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allUser", { action: "allUser", session: req.session });
});

router.get("/allBooking", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allBooking", { action: "allBooking", session: req.session });
});

router.get("/complains", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/complains", { action: "complains", session: req.session });
});

module.exports = router;
