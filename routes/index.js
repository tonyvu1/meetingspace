const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  res.render("home", {title: "Learn English Online | SideTutor"});
});

// Use ensureAuthenticated (from /config/auth.js) to PROTECT this route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});
module.exports = router;
