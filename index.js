// Requires
require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const app = express();

// Configs
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/node-passport';
const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'someSecret',
  resave: true,
  saveUninitialized: true
};

// Mongoose connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
  });

// Passport strategy
require('./services/passport')(passport);

// App views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession(SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();

  next();
});

// Routes
app.use('/', require('./routes'));

// App listening
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
