const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");





router.get("/chat", ensureAuthenticated, (req, res) => {
  res.render("chat2", {
    title: "Scaledrone 1 | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});





module.exports = router;



