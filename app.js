
let twilio = require("twilio");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
var favicon = require("serve-favicon");
const app = express();

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

// DOTENV

/***************************** TWILIO CHAT *******************************/
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

app.get("/token", function(req, res) {
  let username = req.query.username;
  console.log("username is: ", username);
  let token = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_SID,
    process.env.API_SECRET,
    {
      identity: username,
      ttl: 40000
    }
  );

  let grant = new ChatGrant({ serviceSid: process.env.SERVICE_SID });

  token.addGrant(grant);
  const tokenJwt = token.toJwt();
  console.log("token: " + tokenJwt);

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
    cookie:{_expires : 43200000},
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
app.use("/animations", express.static(__dirname + "/views"));

// TEST
app.get("/chat1", (req, res) => {
  res.render("chat1", { title: "Classroom | SideTutor" });
});



app.get("/chat3", (req, res) => {
  res.render("chat3", {
    title: "Classroom | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});


const Student = require('./models/Student')
app.get('/jwt', async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
} catch (err) {
    res.status(500).json({ message: err.message })
}
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));


















/*
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
var favicon = require("serve-favicon");
const app = express();

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

// DOTENV
/***************************** HANDLE PRODUCTION *******************************
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
app.use("/animations", express.static(__dirname + "/views"));

// TEST
app.get("/chat1", (req, res) => {
  res.render("chat1", { title: "Firebase | SideTutor" });
});

app.get("/chat2", (req, res) => {
  res.render("chat2", {
    title: "Scaledrone 1 | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});

app.get("/chat3", (req, res) => {
  res.render("chat3", {
    title: "Scaledrone 2 | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});


const Student = require('./models/Student')
app.get('/jwt', async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
} catch (err) {
    res.status(500).json({ message: err.message })
}
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));






*/




