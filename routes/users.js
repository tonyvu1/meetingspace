const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register Handle / POST
router.post("/register", (req, res) => {
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

  // If any of these errors is true, re-render this register page.
  // Also, we are going to pass in values to the re-rendered page.
  if (errors.length > 0) {
    res.render("register", {
      // Pass in values and do not erase values from previous sent form
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Register form success

    // .findOne is a mongodb method that searches for duplicate users
    User.findOne({ email: email }).then(user => {
      if (user) {
        // If user exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          // Pass in values and do not erase values from previous sent form
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // All went well, now creating a new user
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed password
            newUser.password = hash;

            // Save user. Uses a promise that gives us the user and redirects to login page
            newUser
              .save()
              .then(user => {
                res.redirect("/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
