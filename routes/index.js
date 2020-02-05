const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.render("home", { title: "MeetingSpace" });
});

/*
 *  @desc     Get login page. If user as already logged in, reroute to meeting room.
 *  @params   (req, res)
 */
router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/meetings/meeting");
  } else {
    res.render("login", { title: "Login | MeetingSpace" });
  }
});

/*
 *  @desc     Post route to return login page. Authenticates user with passport.
 *  @params   (req, res, next)
 */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/meetings/meeting",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

/*
 *  @desc     Get route to logout user
 *  @params   (req, res)
 */
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out.");
  res.redirect("/login");
});

/*
 *  @desc     Get sign-up page
 *  @params   (req, res)
 */
router.get("/signup", (req, res) => {
  if (req.user) {
    res.redirect("/meetings/meeting");
  } else {
    res.render("signup", { title: "Sign Up | MeetingSpace" });
  }
});

/*
 *  @desc     Post route to sign up new user
 *  @params   (req, res)
 */
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
      title: "Sign Up | MeetingSpace"
    });
  } else {
    // Register form success

    // .findOne is a mongodb method that searches for duplicate students
    User.findOne({ email: email }).then(user => {
      if (user) {
        // If user exists
        errors.push({ msg: "That email is already in use." });
        res.render("signup", {
          // Pass in values and do not erase values from previous sent form
          errors,
          name,
          email,
          password,
          password2,
          title: "Sign Up | MeetingSpace"
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
              .then(newUser => {
                req.flash(
                  "success_msg",
                  "You are now signed up! Please log in below."
                );
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
