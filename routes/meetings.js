const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const url = require("../config/keys").mongoURI;
var ObjectId = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
const Meeting = require("../models/Meeting");

/**
 * Handle POST request to create new meeeting
 */
router.post("/create", ensureAuthenticated, (req, res) => {
  if (req.user.role === "Tutor" || "Admin") {
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

    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

/**
 * Handle POST request to create new meeeting
 */
router.post("/delete", ensureAuthenticated, (req, res) => {
  if (req.user.role === "Tutor" || "Admin") {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
      db.db("MeetingSpace")
        .collection("meetings")
        .deleteOne({ _id: ObjectId(req.body._id) });

      res.redirect("/dashboard");
    });
  } else {
    res.redirect("/");
  }
});

/* router.get("/meeting", ensureAuthenticated, function(req, res) {
  res.render("meeting", {
    title: "Meeting Space"
  });
}); */

router.get("/meeting", ensureAuthenticated, (req, res) => {
  res.render("scaledrone", {
    title: "Meeting | MeetingSpace",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});
/* 

router.post("/create", ensureAuthenticated, (req, res) => {
  if (req.user.role === "Tutor" || "Admin") {
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

    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});


router.post("/delete", ensureAuthenticated, (req, res) => {
    if (req.user.role === "Tutor" || "Admin") {
  
  
      MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
   


    db.db('MeetingSpace').collection('meetings').deleteOne({ _id: ObjectId(req.body._id) });


    res.redirect("/dashboard");

  });

    } else {
      res.redirect("/");
    }
  });
   */
module.exports = router;
