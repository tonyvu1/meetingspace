const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/dashboard", (req, res) => {
  let meetings = Meeting.find({})
    .sort({ start_date: "desc" })
    .exec((err, meetings) => {
      res.render("dashboard_tutor", {
        meetings: meetings,
        title: "Tutor Dashboard | SideTutor"
      });
    });
});

/**
 * Handle POST request to create new meeeting
 */
router.post("/create", (req, res) => {
  const start_time = new Date(req.body.start_date);
  const end_time = new Date(
    start_time.getTime() + parseInt(req.body.duration) * 60000
  );

  const newMeeting = new Meeting({
    start_time,
    end_time,
    booked: false
  });

  newMeeting.save();

  res.redirect("/tutors/dashboard");
});

module.exports = router;
