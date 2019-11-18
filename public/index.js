const express = require("express");
const router = express.Router();
const { ensureAuthenticatedStudent, forwardAuthenticatedStudent } = require("../config/auth");

router.get("/", (req, res) => {
  res.render("home", { title: "Home | SideTutor" });
});

// Use ensureAuthenticated (from /config/auth.js) to PROTECT this route
router.get("/dashboard", ensureAuthenticatedStudent, (req, res) => {
  res.render("dashboard", {
    title: "Student | SideTutor",
    name: req.user.name // has to be "user" here. user is global language specific var
  });
});

module.exports = router;
