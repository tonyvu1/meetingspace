const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");





/**
 * Handle POST request to create new meeeting
 */
router.post("/create", ensureAuthenticated, (req, res) => {

  if(req.user.role === "Tutor") {
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
  }
  else {
    res.redirect("/home");
  }

});








module.exports = router;
