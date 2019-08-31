const bcrypt = require('bcrypt');
const Strategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new Strategy({ usernameField: 'email' }, async (email, password, done) => {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
      } else {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch)
            return done(null, false, { message: 'Incorrect password' });
        });
      }

      done(null, user);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    const user = await User.findOne({ _id });

    done(null, user);
  });
};
