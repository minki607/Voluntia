
// code adopted from passport documentation: http://www.passportjs.org/docs/basic-digest/
// checking for registration by checking Organization document and serialize/deserialize


const LocalStrategy = require('passport-local').Strategy;
const Organization = require('../models/organization');

module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ username: 'email' }, (email, password, done) => {
        Organization.findOne({
          email: email
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });

            }

            if (password != user.password) {
                return done(null, false, { message: 'Password incorrect' });
            } else {
                return done(null, user);
            }
        })
        .catch(err => {
            return done(err);
        });
      })
    );

    //  get information from a user object to store in a session (serialize),
    //  and take that information and turn it back into a user object (deserialize)
  
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
        Organization.findById(id, function(err, user) {
        done(err, user);
      });
    });
};