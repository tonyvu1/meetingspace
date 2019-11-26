const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Meeting = require("../models/Meeting");



router.get("/class", ensureAuthenticated, function(req, res) {
    res.render("classroom_tutor", {
      title: "Classroom | SideTutor",
      room: "Room1"
    });
  });

  router.get("/chat1", ensureAuthenticated, (req, res) => {
    res.render("chat1", { title: "Classroom | SideTutor" });
  });
  
  router.get("/chat3", ensureAuthenticated, (req, res) => {
    res.render("scaledrone", {
      title: "Scaledrone 2 | SideTutor",
      scaledrone: process.env.SCALEDRONE_ID,
      stun_url: process.env.STUN_URL,
      stun_user: process.env.STUN_USER,
      stun_cred: process.env.STUN_CRED
    });
  });


module.exports = router;
