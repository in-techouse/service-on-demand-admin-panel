var express = require("express");
var router = express.Router();

var firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get("/", function(req, res) {
  if (req.session.isAdmin) {
    res.redirect("/admin");
  }
  res.render("pages/login", { error: "" });
});

router.post("/", function(req, res) {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.userEmail, req.body.userPassword)
    .then(are => {
      var id = req.body.userEmail.replace("@", "-");
      id = id.replace(/\./g, "_");
      firebase
        .database()
        .ref()
        .child("Admins")
        .child(id)
        .once("value")
        .then(admin => {
          if (
            admin === null ||
            admin === undefined ||
            admin.val() === null ||
            admin.val() === undefined
          ) {
            res.render("pages/login", {
              error: "You are not authorized to login here"
            });
          } else {
            req.session.id = admin.val().id;
            req.session.email = admin.val().email;
            req.session.name = admin.val().name;
            req.session.isAdmin = true;
            res.redirect("/admin");
          }
        });
    })
    .catch(e => {
      res.render("pages/login", { error: e.message });
    });
});

router.get("/logout", function(req, res) {
  firebase.auth().signOut();
  req.session.destroy(function(err) {
    if (err) {
      res.negotiate(err);
    }
    res.redirect("/");
  });
});
module.exports = router;
