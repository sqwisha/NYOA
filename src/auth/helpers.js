const passport = require('passport-local');

module.exports = {
  ensureAuthenticated(req, res, next) {
    if (!req.user) {
      req.flash('notice', 'You must be signed in in to do that.');
      res.redirect(req.header('Referer') || '/');
    } else {
      next();
    }
  }
}
