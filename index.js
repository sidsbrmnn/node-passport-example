// Requires
require('dotenv').config();
const flash = require('connect-flash');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const app = express();

// Configs
const port = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/node-passport';

// Mongoose connection
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'someSecret',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();

  next();
});

// Routes
app.use('/', require('./routes'));

// App listening
app.listen(port, () => {
  console.log('Listening on port', port);
});
