const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  booked: {
    type: Boolean,
    default: false
  }
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

module.exports = Meeting;
