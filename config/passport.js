const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load Student model
const Student = require("../models/Student");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match Student
      Student.findOne({ email: email })
        .then(student => {
          if (!student) {
            return done(null, false, {
              message: "That email is not registered"
            });
          }

          // Match password
          bcrypt.compare(password, student.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, student);
            } else {
              return done(null, false, { message: "Password incorrect"});
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser(function(student, done) {
    done(null, student.id);
  });

  passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, student) {
      done(err, student);
    });
  });
};
