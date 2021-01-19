
// code adopted from passport documentation: http://www.passportjs.org/docs/basic-digest/

const LocalStrategy = require('passport-local').Strategy;
const Organization = require('../models/organization');
const User = require('../models/user');
const dbUtils = require('../utils/dbUtils');


module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ username: 'email' }, (email, password, done) => {
        dbUtils.isOrganization(email)
        .then(isOrganization => {
          if (isOrganization) {
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
          } else {

            User.findOne({
              email: email
            })
            .then(user => {
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
          }
        })
        .catch(err => {
          res.render('error', {
            title: 'Error'
        })
        });
      })
    );
  
    passport.serializeUser(function(user, done) {
      done(null, {id: user.id, email: user.email});
    });
  
    passport.deserializeUser(function(user, done) {
      dbUtils.isOrganization(user.email)
      .then(isOrganization => {
        if (isOrganization) {
          Organization.findById(user.id, function(err, user) {
            done(err, user);
          });
        } else {
          User.findById(user.id, function(err, user) {
            done(err, user);
          });
        }
      })
      .catch(err => {
        res.render('error', {
          title: 'Error'
      })
      })
    });
};