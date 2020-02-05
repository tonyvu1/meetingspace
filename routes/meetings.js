const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

/*
 *  @desc     Get route to go to meeting.
 *            Authenticated route.
 *            Makes sure user has logged in and then passes user.name to ejs template.
 *  @params   (req, res)
 */
router.get("/meeting", ensureAuthenticated, (req, res) => {
  res.render("meeting", {
    title: "Meeting | MeetingSpace",
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED,
    name: req.user.name
  });
});

module.exports = router;
