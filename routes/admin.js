var express = require("express");
var firebase = require("firebase");
var router = express.Router();

router.get("/", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let count = {
    categories: 0,
    users: 0,
    vendors: 0,
    bookings: 0,
  };
  firebase
    .database()
    .ref()
    .child("Categories")
    .once("value")
    .then((c) => {
      count.categories = c.numChildren();
      firebase
        .database()
        .ref()
        .child("Users")
        .orderByChild("type")
        .equalTo(0)
        .once("value")
        .then((u) => {
          count.users = u.numChildren();
          firebase
            .database()
            .ref()
            .child("Users")
            .orderByChild("type")
            .equalTo(1)
            .once("value")
            .then((v) => {
              count.vendors = v.numChildren();
              firebase
                .database()
                .ref()
                .child("Bookings")
                .once("value")
                .then((b) => {
                  count.bookings = b.numChildren();
                  res.render("pages/admin/index", {
                    action: "dashboard",
                    session: req.session,
                    count: count,
                  });
                });
            });
        });
    })
    .catch((e) => {
      res.render("pages/admin/index", {
        action: "dashboard",
        session: req.session,
        count: count,
      });
    });
});

router.get("/createCategory", function (req, res) {
  //   res.redirect("/");
  // }
  res.render("pages/admin/createCategory", {
    action: "createCategory",
    session: req.session,
  });
});

router.post("/createCategory", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let id = firebase.database().ref().child("Categories").push().key;
  let category = {
    id: id,
    name: req.body.name,
    url: req.body.url,
  };
  firebase
    .database()
    .ref()
    .child("Categories")
    .child(category.id)
    .set(category)
    .then((r) => {
      res.redirect("/admin/allCategories");
    })
    .catch((e) => {
      res.render("pages/admin/createCategory", {
        action: "createCategory",
        session: req.session,
      });
    });
});

router.get("/allCategories", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  firebase
    .database()
    .ref()
    .child("Categories")
    .orderByChild("name")
    .once("value")
    .then((d) => {
      res.render("pages/admin/allCategories", {
        action: "allCategories",
        session: req.session,
        data: d,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allCategories", {
        action: "allCategories",
        session: req.session,
        data: [],
      });
    });
});

router.get("/editCategory", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  firebase
    .database()
    .ref()
    .child("Categories")
    .child(req.query.id)
    .once("value")
    .then((d) => {
      res.render("pages/admin/editCategory", {
        action: "editCategory",
        session: req.session,
        data: d.val(),
      });
    })
    .catch((e) => {
      res.redirect("/admmin/allCategories");
    });
});

router.post("/editCategory", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let category = {
    id: req.body.id,
    name: req.body.name,
    url: req.body.url,
  };
  firebase
    .database()
    .ref()
    .child("Categories")
    .child(category.id)
    .set(category)
    .then((r) => {
      res.redirect("/admin/allCategories");
    })
    .catch((e) => {
      res.redirect("/admin/editCategory?id=" + req.body.id);
    });
});

router.get("/createVendor", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  firebase
    .database()
    .ref()
    .child("Categories")
    .orderByChild("name")
    .once("value")
    .then((c) => {
      res.render("pages/admin/createVendor", {
        action: "createVendor",
        session: req.session,
        data: c,
      });
    })
    .catch((e) => {
      res.render("pages/admin/createVendor", {
        action: "createVendor",
        session: req.session,
        data: [],
      });
    });
});

router.post("/createVendor", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let vendor = {
    id: req.body.phoneNumber,
    phone: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    category: req.body.category,
    perHourCharge: parseInt(req.body.perHourCharge),
    type: 1, // if type = 0 => Customer, and if type = 1 => Vendor
    image: "",
    rating: 0,
  };
  firebase
    .database()
    .ref()
    .child("Users")
    .child(vendor.id)
    .set(vendor)
    .then((r) => {
      res.redirect("/admin/allVendor");
    })
    .catch((e) => {
      res.render("pages/admin/createVendor", {
        action: "createVendor",
        session: req.session,
      });
    });
});

router.get("/allVendor", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("type")
    .equalTo(1)
    .once("value")
    .then((d) => {
      res.render("pages/admin/allVendor", {
        action: "allVendor",
        session: req.session,
        data: d,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allVendor", {
        action: "allVendor",
        session: req.session,
        data: [],
      });
    });
});

router.get("/vendorDetail", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let id = req.query.id.replace(" ", "+");

  firebase
    .database()
    .ref()
    .child("Users")
    .child(id)
    .once("value")
    .then((d) => {
      res.render("pages/admin/vendorDetail", {
        action: "vendorDetail",
        session: req.session,
        data: d.val(),
      });
    })
    .catch((e) => {
      res.redirect("/admin/allVendor");
    });
});

router.get("/editVendor", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let id = req.query.id.replace(" ", "+");

  firebase
    .database()
    .ref()
    .child("Users")
    .child(id)
    .once("value")
    .then((d) => {
      firebase
        .database()
        .ref()
        .child("Categories")
        .orderByChild("name")
        .once("value")
        .then((c) => {
          res.render("pages/admin/editVendor", {
            action: "editVendor",
            session: req.session,
            vendor: d.val(),
            data: c,
          });
        });
    })
    .catch((e) => {
      res.redirect("/admin/allVendor");
    });
});

router.post("/editVendor", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let vendor = {
    id: req.body.phoneNumber,
    phone: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    category: req.body.category,
    perHourCharge: parseInt(req.body.perHourCharge),
    type: 1, // if type = 0 => Customer, and if type = 1 => Vendor
    image: "",
    rating: Integer.parseInt(req.body.rating),
  };
  firebase
    .database()
    .ref()
    .child("Users")
    .child(vendor.id)
    .set(vendor)
    .then((d) => {
      res.redirect("/admin/allVendor");
    })
    .catch((e) => {
      res.redirect("/admin/allVendor");
    });
});

router.get("/allUser", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  firebase
    .database()
    .ref()
    .child("Users")
    .orderByChild("type")
    .equalTo(0)
    .once("value")
    .then((d) => {
      res.render("pages/admin/allUser", {
        action: "allUser",
        session: req.session,
        data: d,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allUser", {
        action: "allUser",
        session: req.session,
        data: [],
      });
    });
});

router.get("/allBooking", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let jobs = [];
  firebase
    .database()
    .ref()
    .child("Jobs")
    .once("value")
    .then((d) => {
      d.forEach((job) => {
        jobs.push(job.val());
      });
      jobs.reverse();
      res.render("pages/admin/allBooking", {
        action: "allBooking",
        session: req.session,
        data: jobs,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allBooking", {
        action: "allBooking",
        session: req.session,
        data: jobs,
      });
    });
});

router.get("/bookingDetail", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }

  let id = req.query.id;
  firebase
    .database()
    .ref()
    .child("Jobs")
    .child(id)
    .once("value")
    .then((jobData) => {
      if (jobData === null || jobData === undefined) {
        res.redirect("/admin/allBooking");
      }
      firebase
        .database()
        .ref()
        .child("Users")
        .child(jobData.val().userId)
        .once("value")
        .then((userData) => {
          if (userData === null || userData === undefined) {
            res.redirect("/admin/allBooking");
          }
          if (
            jobData.val().workerId === null ||
            jobData.val().workerId === undefined ||
            jobData.val().workerId.length < 1
          ) {
            res.render("pages/admin/bookingDetail", {
              action: "bookingDetail",
              session: req.session,
              job: jobData.val(),
              user: userData.val(),
              vendor: null,
            });
          }
          firebase
            .database()
            .ref()
            .child("Users")
            .child(jobData.val().workerId)
            .once("value")
            .then((vendorData) => {
              if (vendorData === null || vendorData === undefined) {
                res.redirect("/admin/allBooking");
              }
              res.render("pages/admin/bookingDetail", {
                action: "bookingDetail",
                session: req.session,
                job: jobData.val(),
                user: userData.val(),
                vendor: vendorData.val(),
              });
            });
        });
    })
    .catch((e) => {
      res.redirect("/admin/allBooking");
    });
});

router.get("/complains", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }
  let complains = [];
  firebase
    .database()
    .ref()
    .child("Complains")
    .once("value")
    .then((d) => {
      d.forEach((complain) => {
        complains.push(complain.val());
      });
      complains.reverse();
      res.render("pages/admin/complains", {
        action: "complains",
        session: req.session,
        data: complains,
      });
    })
    .catch((e) => {
      res.render("pages/admin/allComplains", {
        action: "allComplains",
        session: req.session,
        data: complains,
      });
    });
});
router.get("/complainDetail", function (req, res) {
  // if (!req.session.isAdmin) {
  //   res.redirect("/");
  // }

  let id = req.query.id;
  firebase
    .database()
    .ref()
    .child("Complains")
    .child(id)
    .once("value")
    .then((c) => {
      if (c.val() === null || c.val() === undefined) {
        res.redirect("/admin/complains");
      }
      firebase
        .database()
        .ref()
        .child("Jobs")
        .child(c.val().jobId)
        .once("value")
        .then((jobData) => {
          if (jobData === null || jobData === undefined) {
            res.redirect("/admin/complains");
          }
          firebase
            .database()
            .ref()
            .child("Users")
            .child(jobData.val().userId)
            .once("value")
            .then((userData) => {
              if (userData === null || userData === undefined) {
                res.redirect("/admin/complains");
              }
              firebase
                .database()
                .ref()
                .child("Users")
                .child(jobData.val().workerId)
                .once("value")
                .then((vendorData) => {
                  if (vendorData === null || vendorData === undefined) {
                    res.redirect("/admin/complains");
                  }
                  res.render("pages/admin/complainDetail", {
                    action: "complainDetail",
                    session: req.session,
                    complain: c.val(),
                    job: jobData.val(),
                    user: userData.val(),
                    vendor: vendorData.val(),
                  });
                });
            });
        });
    })
    .catch((e) => {
      res.redirect("/admin/complains");
    });
});

module.exports = router;
