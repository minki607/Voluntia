
//code adopted and modified from passport documentation: http://www.passportjs.org/docs/basic-digest/

const dbUtils = require('../utils/dbUtils');

//ensure authentication as volunteer/organization
module.exports = {
    ensureAuthenticatedAsUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    },

    //use email to check if it's organization and redirect them accordingly.
    // If not ensured pass on error message to be used in template
    ensureAuthenticatedAsOrganization: function(req, res, next) {
      if (req.user && req.user.email) {
        dbUtils.isOrganization(req.user.email).then(isOrganization => {
          if (req.isAuthenticated() && isOrganization) {
            return next();
          }
          res.redirect('/login');
        });
      } else {
        const message = { type: 'alert-danger', body: 'Please login to continue'}
        res.render('login', {message});
      }
    }
};