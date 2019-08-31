const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.get('/', ensureLoggedOut('/dashboard'), (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/dashboard', ensureLoggedIn('/login'), (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.user });
});

router.get('/login', ensureLoggedOut('/dashboard'), (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/profile', ensureLoggedIn('/login'), async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { name: req.body.name },
    { new: true }
  );

  req.login(user, err => {
    if (err)
      return res.render('profile', {
        error: 'Something went wrong',
        user: req.user
      });
  });

  res.render('profile', { success: 'Profile saved', user: req.user });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
