const express = require("express");
const app = express();
const path = require('path');
const staticRoutes = require('../src/routes/static/index');
const userRoutes = require('../src/routes/users');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

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

app.use(staticRoutes);
app.use(userRoutes);

module.exports = app;
