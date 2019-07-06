const express = require("express");
const app = express();
const path = require('path');
const staticRoutes = require('./routes/static/index');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passportConfig = require('./config/passport-config');

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

app.use(staticRoutes);
app.use(userRoutes);

module.exports = app;
