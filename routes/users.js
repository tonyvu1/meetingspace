const express = require("express");
const router = express.Router();

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

  let errors = []

  // Check required fields
  if(!name || !email || !password || !password2) {
      errors.push({msg: 'Please fill in all fields'})
  }

  // Check passwords match
  if(password !== password2) {
      errors.push({msg: 'Passwords do not match'})
  }

  // Check password length
  if(password.length < 6) {
      errors.push({msg: 'Password should be at least 6 characters long'})
  }

  // If any of these errors is true, re-render this register page.
  // Also, we are going to pass in values to the re-rendered page.
  if(errors.length > 0) {
    res.render('register', {
        // Pass in values and do not erase values from previous sent form
        errors,
        name,
        email,
        password,
        password2
    })
  }
  else {
      res.send('pass')
  }
});

module.exports = router;
