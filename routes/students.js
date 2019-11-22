const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Meeting = require("../models/Meeting");




router.get("/chat", ensureAuthenticated, (req, res) => {

  if(req.user.role === "Student") {
    res.render("chat2", {
      title: "Scaledrone 1 | SideTutor",
      scaledrone: process.env.SCALEDRONE_ID,
      stun_url: process.env.STUN_URL,
      stun_user: process.env.STUN_USER,
      stun_cred: process.env.STUN_CRED
    });
  }
  else if(req.user.role === "Tutor") {
    res.redirect('/dashboard')
  }
  else {
    res.redirect('/')
  }
  
});





module.exports = router;



