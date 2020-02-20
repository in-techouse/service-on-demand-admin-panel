var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/index", {
    action: "dashboard",
    session: req.session
  });
});

router.get("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/createVendor", {
    action: "createVendor",
    session: req.session
  });
});

router.post("/createVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  let vendor = {
    id: req.body.phoneNumber,
    phone: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    category: req.body.category,
    perHourCharge: req.body.perHourCharge,
    type: 1, // if type = 0 => Customer, and if type = 1 => Vendor
    image: "",
    rating: 0
  };
  firebase
    .database()
    .ref()
    .child("Users")
    .child(vendor.id)
    .set(vendor)
    .then(r => {
      res.redirect("/admin/allVendor");
    })
    .catch(e => {
      res.render("pages/admin/createVendor", {
        action: "createVendor",
        session: req.session
      });
    });
});

router.get("/allVendor", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("type")
    .equalTo(1)
    .once("value")
    .then(d => {
      res.render("pages/admin/allVendor", {
        action: "allVendor",
        session: req.session,
        data: d
      });
    })
    .catch(e => {
      res.render("pages/admin/allVendor", {
        action: "allVendor",
        session: req.session,
        data: []
      });
    });
});

router.get("/allUser", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("type")
    .equalTo(0)
    .once("value")
    .then(d => {
      res.render("pages/admin/allUser", {
        action: "allUser",
        session: req.session,
        data: d
      });
    })
    .catch(e => {
      res.render("pages/admin/allUser", {
        action: "allUser",
        session: req.session,
        data: []
      });
    });
});

router.get("/allBooking", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/allBooking", {
    action: "allBooking",
    session: req.session
  });
});

router.get("/complains", function(req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
  }
  res.render("pages/admin/complains", {
    action: "complains",
    session: req.session
  });
});

module.exports = router;
