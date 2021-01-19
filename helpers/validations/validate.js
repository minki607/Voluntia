const validate = {
  /**
   * @method validateUserSignUp
   * @description - Validates users input to ensure that the expected information are inputed also Check is the user misses a field
   * @param { function } next - calls the next middle when this middle has been executed
   */
  validateUserSignUp: (req, res, next) => {
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);
    /**
     * Add more validations here
     */
    next();
  },
    /**
   * @method validateUserSignUp
   * @description - Validates users input to ensure that the expected information are inputed also Check is the user misses a field
   * @param { function } next - calls the next middle when this middle has been executed
   */
  validateOrganizationSignUp: (req, res, next) => {
    req.checkBody('name', 'Organization name is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);
    /**
     * Add more validations here
     */
    next();
  },

  /**
   * @method validateUserLogin
   * @description - check if the email and password are valid
   * @param { function } next - calls the next middle when this middle has been executed
   */
  validateUserLogin: (req, res, next) => {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    /**
     * Add more validations here
     */
    next();
  }
}

module.exports = validate;