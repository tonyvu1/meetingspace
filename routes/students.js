const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Login page
router.get("/login", (req, res) => {
  res.render("login", {title: "Login | SideTutor"});
});

// Register page
router.get("/signup", (req, res) => {
  res.render("signup", {title: "Sign Up | SideTutor"});
});

// Register Handle / POST
router.post("/signup", (req, res) => {
  // pulling out info in const { }
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters long" });
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
        errors.push({ msg: "Email is already signuped" });
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
                  "You are now signed up and can log in!"
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

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/students/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/students/login");
});

module.exports = router;
