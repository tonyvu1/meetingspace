const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticatedStudent, forwardAuthenticatedStudent } = require("../config/auth");


// Use ensureAuthenticated (from /config/auth.js) to PROTECT this route
router.get("/dashboard", ensureAuthenticatedStudent, (req, res) => {
  res.render("dashboard_student", {
    title: "Student | SideTutor",
    name: req.user.name // has to be "user" here. user is global language specific var
  });
});

router.get("/chat", (req, res) => {
  res.render("chat2", {
    title: "Scaledrone 1 | SideTutor",
    scaledrone: process.env.SCALEDRONE_ID,
    stun_url: process.env.STUN_URL,
    stun_user: process.env.STUN_USER,
    stun_cred: process.env.STUN_CRED
  });
});

// GETTING LOGIN PAGE
router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/students/dashboard");
  } else {
    res.render("login", { title: "Login | SideTutor" });
  }
});

// POSTING TO LOGIN PAGE TO LOG IN USER
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/students/dashboard",
    failureRedirect: "/students/login",
    failureFlash: true
  })(req, res, next);
});

// GETTING LOGOUT TO LOGOUT USER
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out.");
  res.redirect("/students/login");
});

// GETTING SIGN UP PAGE
router.get("/signup", (req, res) => {
  if (req.user) {
    res.redirect("/students/dashboard");
  } else {
    res.render("signup", { title: "Sign Up | SideTutor" });
  }
});

// POSTING TO SIGNUP NEW USER
router.post("/signup", (req, res) => {
  // pulling out info in const { }
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields." });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords must match." });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Your password should be at least 6 characters long." });
  }

  // If any of these errors is true, re-render this signup page.
  // Also, we are going to pass in values to the re-rendered page.
  if (errors.length > 0) {
    res.render("signup", {
      // Pass in values and do not erase values from previous sent form
      errors,
      name,
      email,
      password,
      password2,
      title: "Sign Up | SideTutor"
    });
  } else {
    // Register form success

    // .findOne is a mongodb method that searches for duplicate students
    Student.findOne({ email: email }).then(student => {
      if (student) {
        // If user exists
        errors.push({ msg: "That email is already in use." });
        res.render("signup", {
          // Pass in values and do not erase values from previous sent form
          errors,
          name,
          email,
          password,
          password2,
          title: "Sign Up | SideTutor"
        });
      } else {
        // All went well, now creating a new user

        const newStudent = new Student({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed password
            newStudent.password = hash;

            // Save user. Uses a promise that gives us the user and redirects to login page
            newStudent
              .save()
              .then(newStudent => {
                req.flash(
                  "success_msg",
                  "You are now signed up! Please log in below."
                );
                res.redirect("/students/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});


module.exports = router;



