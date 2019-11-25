const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
var favicon = require("serve-favicon");
const app = express();
const twilio = require('twilio')
/******************** FORCE HTTPS (UNCOMMENT WHEN DEPLOY) *********************/

/* app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
app.use(express.static("build"));
app.use(function(req, res, next) {
  var sslUrl;

  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    sslUrl = ["https://sidetutor.com", req.url].join("");
    return res.redirect(sslUrl);
  }

  return next();
});
var https_redirect = function(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] != "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  } else {
    return next();
  }
};
app.use(https_redirect);  */

/***************************** TWILIO CHAT *******************************/
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
var VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION_CHAT = 3600; // 1 hour

app.get("/tokenChat", function(req, res) {
  let username = req.query.username;
  console.log("username is: ", username);
  let token = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_SID,
    process.env.API_SECRET,
    {
      identity: username,
      ttl: MAX_ALLOWED_SESSION_DURATION_CHAT
    }
  );

  let chatGrant = new ChatGrant({ serviceSid: process.env.SERVICE_SID });
  var videoGrant = new VideoGrant();

  token.addGrant(chatGrant);
  token.addGrant(videoGrant);
  const tokenJwt = token.toJwt();
  res.send(tokenJwt);
}); 


/***************************** HANDLE PRODUCTION *******************************/
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

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
    secret: process.env.SESSION_SECRET,
    cookie: { _expires: 43200000 },
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
app.use("/", require("./routes/index"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/students", require("./routes/students"));
app.use("/tutors", require("./routes/tutors"));
app.use("/meetings", require("./routes/meetings"));
app.use("/style", express.static(__dirname + "/public/style"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/config", express.static(__dirname + "/config"));
app.use("/animations", express.static(__dirname + "/views"));

// TEST

app.get("/chat1", (req, res) => {
  res.render("chat1", { title: "Classroom | SideTutor" });
});

app.get("/chat3", (req, res) => {
  res.render("scaledrone", {
    title: "Scaledrone 2 | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});

/***************************** TWILIO VIDEO *******************************/
const MAX_ALLOWED_SESSION_DURATION = 14400;


var VideoGrant = AccessToken.VideoGrant;

app.get('/tokenVideo', function(request, response) {
 // var identity = request.user.name;
 var identity = Math.random().toString(36).substring(7);

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_SID,
    process.env.API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});


app.get("/class", function(req, res) {
  res.render("classroom_tutor", {
    title: "Classroom | SideTutor",
    room: "Room1"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

