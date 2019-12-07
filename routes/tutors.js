const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Meeting = require("../models/Meeting");





  router.get("/chat1", ensureAuthenticated, (req, res) => {
    res.render("chat1", { title: "Classroom | MeetingSpace" });
  });
  
  router.get("/chat3", ensureAuthenticated, (req, res) => {
    res.render("scaledrone", {
      title: "Scaledrone 2 | MeetingSpace",
      scaledrone: process.env.SCALEDRONE_ID,
      stun_url: process.env.STUN_URL,
      stun_user: process.env.STUN_USER,
      stun_cred: process.env.STUN_CRED
    });
  });


module.exports = router;
