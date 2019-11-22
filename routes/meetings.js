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
      db.db("sidetutor")
        .collection("meetings")
        .deleteOne({ _id: ObjectId(req.body._id) });

      res.redirect("/dashboard");
    });
  } else {
    res.redirect("/");
  }
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
   


    db.db('sidetutor').collection('meetings').deleteOne({ _id: ObjectId(req.body._id) });


    res.redirect("/dashboard");

  });

    } else {
      res.redirect("/");
    }
  });
   */
module.exports = router;
