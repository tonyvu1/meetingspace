const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
var favicon = require("serve-favicon");

// DOTENV
/***************************** HANDLE PRODUCTION *******************************/
if (process.env.NODE_ENV !== "production") {
  require('dotenv/config');
}


const app = express();
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// Passport Config
require("./config/passport")(passport);

// flash and session used for passing data to redirect pages
const flash = require("connect-flash");
const session = require("express-session");

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
// Flash mainly used to passing around global variables
app.use(flash());

// Global Variables
// creating a global var with 'res.locals.success_msg'
// then using flash to point it to that var
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./public/index"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/students", require("./routes/students"));
app.use("/style", express.static(__dirname + "/public/style"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
