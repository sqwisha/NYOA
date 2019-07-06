const User = require('../db/models').User;
const bcrypt = require('bcrypt');

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
        // TODO auto sign in
        req.flash('notice', 'Successfully signed up!');
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/users/sign_up');
      });
    });
  }
};
