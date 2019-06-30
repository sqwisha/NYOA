const express = require("express");
const app = express();
const path = require('path');
const staticRoutes = require('../src/routes/static/index');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(staticRoutes);

module.exports = app;
