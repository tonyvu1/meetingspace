// This is used for PROTECTED ROUTES

module.exports = {
  ensureAuthenticatedStudent: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view your student dashboard.");
    res.redirect("/students/login");
  },
  forwardAuthenticatedStudent: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  }
};
