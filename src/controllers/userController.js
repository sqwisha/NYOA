const User = require('../db/models').User;
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = {
  signUp (req, res, next) {
    res.render('users/sign_up');
  },
  create (req, res, next) {
    bcrypt.hash(req.body.password, 10)
    .then((hashedPassword) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      .then((user) => {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/');
        });
      })
      .catch((err) => {
        req.flash('error', err.message);
        res.redirect('/users/sign_up');
      });
    });
  },
  signIn(req, res, next) {
    res.render('users/sign_in');
  },
  login(req, res, next) {
    passport.authenticate('local')(req, res, () => {
      if (req.user === undefined || !req.user.passwordMatch) {
        req.logout();
        req.flash('notice', 'Sign in failed. Please try again.');
        res.redirect('/users/sign_in');
      } else {
        res.redirect('/');
      }
    });
  },
  logout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
};
