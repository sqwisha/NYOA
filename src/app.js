require('dotenv').config()
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passportConfig = require('./config/passport-config');

const homeRoute = require('./routes/index');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/story');

app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('whatever remains'));
app.use(session({
  secret: process.env.cookieSecret || require('crypto').randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1.21e+9 }
}));
app.use(flash());

passportConfig.init(app);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// mock-auth
if (process.env.NODE_ENV === 'test') {
  let id, email;

  app.use((req, res, next) => {
    id = req.body.id || id;
    email = req.body.email || email;

    if (id && id != 0) {
      req.user = {
        id: id,
        email: email
      };
    } else if (id = 0) {
      delete req.user;
    }
    if (next) { next() }
  });

  app.get('/auth/mock', (req, res) => {
    res.redirect('/');
  });

}

app.use(homeRoute);
app.use(userRoutes);
app.use(storyRoutes);

module.exports = app;
